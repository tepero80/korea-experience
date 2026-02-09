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
        
        # 스트림 끊김 - 상태 출력
        current_text = "".join(full_text)
        print(f"\n   (스트림 종료, 총 {event_count}개 이벤트 수신, 누적 텍스트: {len(current_text):,}자)")
        return None

    # 1. 초기 스트림 시도 (interaction_id 획득용)
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

    # 2. 스트림 끊김 → 즉시 폴링으로 전환
    if not is_complete and interaction_id:
        print(f"\n🔄 스트림 끊김 → 폴링 모드로 전환 (30초 간격)")
        poll_interval = 30
        max_poll_time = 2400  # 최대 40분 대기
        poll_start = time.time()
        
        while time.time() - poll_start < max_poll_time:
            time.sleep(poll_interval)
            try:
                check = client.interactions.get(interaction_id)
                elapsed = time.time() - start_time
                mins, secs = int(elapsed // 60), int(elapsed % 60)
                status = check.status
                print(f"   [{mins:02d}:{secs:02d}] 상태: {status}")
                
                if status == "completed":
                    result = check.outputs[-1].text
                    print(f"\n✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
                    return result
                elif status in ("failed", "cancelled"):
                    raise RuntimeError(f"❌ 리서치 실패: {status}")
                    
            except RuntimeError:
                raise
            except Exception as e:
                print(f"   ⚠️ 폴링 에러: {e}")
        
        raise RuntimeError(f"❌ 최대 대기 시간 초과 (총 {int((time.time()-start_time)//60)}분)")
    
    raise RuntimeError("❌ Interaction ID를 받지 못했습니다.")
