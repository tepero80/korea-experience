"""
Deep Research 리서치 모듈
=========================
Gemini Deep Research API를 호출하여 드래프트를 생성합니다.

사용:
  from deep_dive.research import run_deep_research, build_prompt
"""

import re
import time

from .config import (
    PROMPT_FILE, RESEARCH_AGENT,
)


def build_prompt(topic: str, category: str) -> str:
    """PROMPT.md 템플릿에 주제를 삽입한 프롬프트를 반환합니다."""
    with open(PROMPT_FILE, "r", encoding="utf-8") as f:
        template = f.read()

    prompt = re.sub(r"\[.*?\]", f"[{topic}]", template, count=1)
    prompt += f"\n\n---\n## CATEGORY HINT\nThis topic belongs to: **{category}**\n"
    prompt += f"Topic to research: **{topic}**\n"
    return prompt


def run_deep_research(prompt: str, api_key: str) -> str:
    """Deep Research API 호출 (스트리밍 + 재개)"""
    from google import genai

    client = genai.Client(api_key=api_key)

    print("🔬 Deep Research 시작...")
    print(f"   에이전트: {RESEARCH_AGENT}")

    # 상태 추적
    interaction_id = None
    last_event_id = None
    full_text = []
    start_time = time.time()
    is_complete = False

    def process_stream(event_stream):
        """스트림 이벤트 처리"""
        nonlocal interaction_id, last_event_id, full_text, is_complete
        
        event_count = 0
        for chunk in event_stream:
            event_count += 1
            
            # Interaction ID 저장
            if chunk.event_type == "interaction.start":
                interaction_id = chunk.interaction.id
                print(f"   Interaction ID: {interaction_id}")

            # Event ID 저장 (재개용)
            if chunk.event_id:
                last_event_id = chunk.event_id

            # 콘텐츠 처리
            if chunk.event_type == "content.delta":
                if chunk.delta.type == "text":
                    full_text.append(chunk.delta.text)
                    print(".", end="", flush=True)
                elif chunk.delta.type == "thought_summary":
                    elapsed = time.time() - start_time
                    mins, secs = int(elapsed // 60), int(elapsed % 60)
                    thought = chunk.delta.content.text[:80]
                    print(f"\n   [{mins:02d}:{secs:02d}] 💭 {thought}...")

            # 완료 확인
            elif chunk.event_type == "interaction.complete":
                is_complete = True
                elapsed = time.time() - start_time
                mins, secs = int(elapsed // 60), int(elapsed % 60)
                result = "".join(full_text)
                print(f"\n✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
                return result
        
        print(f"\n   (스트림 종료, 총 {event_count}개 이벤트 수신)")
        return None

    # 1. 초기 스트림 시도
    try:
        initial_stream = client.interactions.create(
            input=prompt, agent=RESEARCH_AGENT, background=True, stream=True,
            agent_config={"type": "deep-research", "thinking_summaries": "auto"},
        )
        result = process_stream(initial_stream)
        if result:
            return result
    except Exception as e:
        print(f"\n⚠️ 스트림 에러: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

    # 2. 재개 루프 (최대 10회 시도)
    max_retries = 10
    retry_count = 0
    
    while not is_complete and interaction_id and retry_count < max_retries:
        retry_count += 1
        print(f"\n🔄 스트림 재개 중... (시도 {retry_count}/{max_retries}, event_id: {last_event_id})")
        time.sleep(2)

        try:
            resume_stream = client.interactions.get(
                id=interaction_id,
                stream=True,
                last_event_id=last_event_id
            )
            result = process_stream(resume_stream)
            if result:
                return result
        except Exception as e:
            print(f"⚠️ 재개 실패: {e}")

    # 3. 재개 실패 시 최종 상태 확인
    if not is_complete and interaction_id:
        print(f"\n🔍 재개 실패 - 서버 상태 확인 중...")
        try:
            final_interaction = client.interactions.get(interaction_id)
            if final_interaction.status == "completed":
                result = final_interaction.outputs[-1].text
                elapsed = time.time() - start_time
                mins, secs = int(elapsed // 60), int(elapsed % 60)
                print(f"✅ 서버에서 완료됨! ({mins}분 {secs}초, {len(result):,}자)")
                return result
            else:
                print(f"❌ 서버 상태: {final_interaction.status}")
                raise RuntimeError(f"❌ 작업 미완료: {final_interaction.status}")
        except Exception as e:
            print(f"❌ 상태 확인 실패: {e}")
            raise RuntimeError(f"❌ 스트림 재개 {max_retries}회 시도 후 실패")
