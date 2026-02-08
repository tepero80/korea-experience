"""
Deep Research 리서치 모듈
=========================
Gemini Deep Research API를 호출하여 드래프트를 생성합니다.

사용:
  from deep_dive.research import run_deep_research, run_deep_research_streaming, build_prompt
"""

import re
import time

from .config import (
    PROMPT_FILE, RESEARCH_AGENT, POLL_INTERVAL, MAX_WAIT,
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
    """Deep Research API 호출 (폴링 모드)"""
    from google import genai

    client = genai.Client(api_key=api_key)

    print("🔬 Deep Research 시작...")
    print(f"   에이전트: {RESEARCH_AGENT}")

    interaction = client.interactions.create(
        input=prompt, agent=RESEARCH_AGENT, background=True,
    )
    interaction_id = interaction.id
    print(f"   Interaction ID: {interaction_id}")

    start_time = time.time()
    last_status = None

    while True:
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT:
            raise TimeoutError(f"⏰ {MAX_WAIT}초 초과. Interaction ID: {interaction_id}")

        interaction = client.interactions.get(interaction_id)
        status = interaction.status

        if status != last_status:
            mins, secs = int(elapsed // 60), int(elapsed % 60)
            print(f"   [{mins:02d}:{secs:02d}] 상태: {status}")
            last_status = status

        if status == "completed":
            result = interaction.outputs[-1].text
            mins, secs = int(elapsed // 60), int(elapsed % 60)
            print(f"✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result
        elif status in ("failed", "cancelled"):
            raise RuntimeError(f"❌ 실패: {status}")

        time.sleep(POLL_INTERVAL)


def run_deep_research_streaming(prompt: str, api_key: str) -> str:
    """Deep Research API 스트리밍 모드 호출"""
    from google import genai

    client = genai.Client(api_key=api_key)

    print("🔬 Deep Research 시작 (스트리밍 모드)...")
    print(f"   에이전트: {RESEARCH_AGENT}")

    stream = client.interactions.create(
        input=prompt, agent=RESEARCH_AGENT, background=True, stream=True,
        agent_config={"type": "deep-research", "thinking_summaries": "auto"},
    )

    interaction_id = None
    full_text = []
    start_time = time.time()

    for chunk in stream:
        if chunk.event_type == "interaction.start":
            interaction_id = chunk.interaction.id
            print(f"   Interaction ID: {interaction_id}")

        if chunk.event_type == "content.delta":
            if chunk.delta.type == "text":
                full_text.append(chunk.delta.text)
                print(".", end="", flush=True)
            elif chunk.delta.type == "thought_summary":
                elapsed = time.time() - start_time
                mins, secs = int(elapsed // 60), int(elapsed % 60)
                thought = chunk.delta.content.text[:80]
                print(f"\n   [{mins:02d}:{secs:02d}] 💭 {thought}...")

        elif chunk.event_type == "interaction.complete":
            elapsed = time.time() - start_time
            mins, secs = int(elapsed // 60), int(elapsed % 60)
            result = "".join(full_text)
            print(f"\n✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result

    # 스트림 종료 후 complete 없으면 폴링 전환
    if interaction_id:
        print("\n⚠️ 스트림 종료 — 폴링으로 전환...")
        return _poll_for_result(client, interaction_id, start_time)

    raise RuntimeError("❌ 스트림에서 결과를 받지 못했습니다.")


def _poll_for_result(client, interaction_id: str, start_time: float) -> str:
    """스트리밍 전환 시 폴링 fallback"""
    while True:
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT:
            raise TimeoutError(f"⏰ {MAX_WAIT}초 초과.")

        interaction = client.interactions.get(interaction_id)
        if interaction.status == "completed":
            result = interaction.outputs[-1].text
            mins, secs = int(elapsed // 60), int(elapsed % 60)
            print(f"✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result
        elif interaction.status in ("failed", "cancelled"):
            raise RuntimeError(f"❌ 실패: {interaction.status}")
        time.sleep(POLL_INTERVAL)
