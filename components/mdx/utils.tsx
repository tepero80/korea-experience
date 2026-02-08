import React from 'react';

/**
 * JSX prop 문자열 안의 간단한 마크다운을 React 엘리먼트로 변환
 * 지원: **bold**, *italic*, [link text](url)
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') return text;

  // 마크다운 패턴이 없으면 그대로 반환
  if (!/\*|]\(/.test(text)) return text;

  const parts: React.ReactNode[] = [];
  // **bold**, *italic*, [text](url) 순서로 매칭
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // 매치 이전 텍스트
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // **bold**
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      // *italic*
      parts.push(<em key={match.index}>{match[2]}</em>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // [text](url)
      parts.push(
        <a key={match.index} href={match[4]} className="text-blue-600 underline hover:text-blue-800">
          {match[3]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // 나머지 텍스트
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
