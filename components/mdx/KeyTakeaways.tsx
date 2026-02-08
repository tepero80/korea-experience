'use client';

import { renderInlineMarkdown } from './utils';

/**
 * KeyTakeaways Component
 * GEO 최적화: AI 엔진이 즉시 인용할 수 있는 40단어 내외의 핵심 요약 박스
 * Deep Research 전략: "답변 우선 구조(Answer-First Structure)" 구현
 */

interface KeyTakeawaysProps {
  /** 핵심 요약 포인트 배열 (1-4개 권장) */
  points: string[];
  /** 선택적 제목 */
  title?: string;
  /** 읽기 시간 (분) */
  readTime?: number;
  /** 마지막 업데이트 날짜 */
  lastUpdated?: string;
}

export default function KeyTakeaways({ 
  points, 
  title = "Key Takeaways",
  readTime,
  lastUpdated 
}: KeyTakeawaysProps) {
  return (
    <div 
      className="my-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg"
      role="region"
      aria-label="Key Takeaways"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-bold text-white m-0 p-0 border-none">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-blue-100">
            {readTime && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime} min read
              </span>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Points */}
      <div className="p-6">
        <ul className="space-y-4 m-0 p-0 list-none">
          {points.map((point, index) => (
            <li 
              key={index}
              className="flex items-start gap-4 text-gray-800 leading-relaxed"
            >
              <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                {index + 1}
              </span>
              <span className="text-lg pt-0.5">{renderInlineMarkdown(point)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* AI Citation hint (semantic for crawlers) */}
      <meta itemProp="description" content={points.join(' ')} />
    </div>
  );
}
