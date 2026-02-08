'use client';

import { renderInlineMarkdown } from './utils';

/**
 * ProsCons Component
 * GEO 최적화: 장단점의 구조화된 표시
 * 시각적으로 명확한 비교를 통해 의사결정 지원
 */

interface ProsConsProps {
  /** 제목 */
  title?: string;
  /** 장점 배열 */
  pros: string[];
  /** 단점 배열 */
  cons: string[];
  /** 스타일 변형 */
  variant?: 'default' | 'compact' | 'cards';
  /** 장점 라벨 */
  prosLabel?: string;
  /** 단점 라벨 */
  consLabel?: string;
}

export default function ProsCons({ 
  title,
  pros, 
  cons,
  variant = 'default',
  prosLabel = 'Pros',
  consLabel = 'Cons'
}: ProsConsProps) {
  if (variant === 'compact') {
    return (
      <div className="my-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
        {title && <h4 className="font-bold text-gray-900 mb-4">{title}</h4>}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span>👍</span> {prosLabel}
            </div>
            <ul className="space-y-1">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {renderInlineMarkdown(pro)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span>👎</span> {consLabel}
            </div>
            <ul className="space-y-1">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-500 mt-0.5">✗</span>
                  {renderInlineMarkdown(con)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="my-8">
        {title && <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center gap-3">
              <span className="text-3xl">👍</span>
              <span className="text-xl font-bold text-white">{prosLabel}</span>
            </div>
            <ul className="p-6 space-y-4">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-gray-700 leading-relaxed">{renderInlineMarkdown(pro)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons Card */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border-2 border-red-200 overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center gap-3">
              <span className="text-3xl">👎</span>
              <span className="text-xl font-bold text-white">{consLabel}</span>
            </div>
            <ul className="p-6 space-y-4">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✗
                  </span>
                  <span className="text-gray-700 leading-relaxed">{renderInlineMarkdown(con)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="my-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 m-0 p-0 border-none">{title}</h3>
        </div>
      )}
      
      <div className="grid md:grid-cols-2">
        {/* Pros Section */}
        <div className="p-6 border-r border-gray-200">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-xl shadow-md">
              👍
            </span>
            <h4 className="text-lg font-bold text-green-700 m-0 p-0 border-none">{prosLabel}</h4>
          </div>
          <ul className="space-y-3">
            {pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <span className="flex-shrink-0 mt-1 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-green-500 group-hover:text-white transition-colors">
                  ✓
                </span>
                <span className="text-gray-700">{renderInlineMarkdown(pro)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons Section */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center text-xl shadow-md">
              👎
            </span>
            <h4 className="text-lg font-bold text-red-700 m-0 p-0 border-none">{consLabel}</h4>
          </div>
          <ul className="space-y-3">
            {cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <span className="flex-shrink-0 mt-1 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-red-500 group-hover:text-white transition-colors">
                  ✗
                </span>
                <span className="text-gray-700">{renderInlineMarkdown(con)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
