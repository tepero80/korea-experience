'use client';

/**
 * FAQAccordion Component
 * GEO 최적화: FAQPage JSON-LD는 blog/[slug]/page.tsx에서 자동 주입
 * Deep Research 전략: AI가 FAQ 섹션을 Featured Snippet으로 인용
 */

import { useState } from 'react';

interface FAQItem {
  /** 질문 */
  question: string;
  /** 답변 */
  answer: string;
}

interface FAQAccordionProps {
  /** 제목 */
  title?: string;
  /** FAQ 항목들 */
  items?: FAQItem[];
  /** FAQ 항목들 (alias) */
  questions?: FAQItem[];
  /** 기본 열린 항목 인덱스 */
  defaultOpen?: number;
  /** 스타일 변형 */
  variant?: 'default' | 'minimal' | 'bordered';
}

export default function FAQAccordion({ 
  title = "Frequently Asked Questions",
  items,
  questions,
  defaultOpen,
  variant = 'default'
}: FAQAccordionProps) {
  const data = items ?? questions ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className="my-8">
        {title && (
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>❓</span> {title}
          </h3>
        )}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-900">
                  {item.question}
                </span>
                <span className={`text-2xl text-gray-400 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <div 
                  className="px-4 pb-4 text-gray-600"
                >
                  <p className="m-0">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className="my-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-stone-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white m-0 p-0 border-none flex items-center gap-2">
          <span>❓</span> {title}
        </h3>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-gray-100">
        {data.map((item, index) => (
          <div 
            key={index}
          >
            <button
              className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors group"
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              {/* Number */}
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                openIndex === index 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-amber-100'
              }`}>
                {index + 1}
              </span>
              
              {/* Question */}
              <span 
                className="flex-1 font-semibold text-gray-900 pt-1"
              >
                {item.question}
              </span>
              
              {/* Toggle Icon */}
              <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all ${
                openIndex === index ? 'rotate-180 bg-amber-100' : ''
              }`}>
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </span>
            </button>
            
            {/* Answer */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div 
                className="px-5 pb-5 pl-16 text-gray-600 leading-relaxed"
              >
                <div 
                  className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg"
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 text-center">
        <p className="text-sm text-gray-600 m-0">
          Have more questions? 
          <a href="/contact" className="text-amber-700 hover:underline ml-1 font-medium">
            Contact us →
          </a>
        </p>
      </div>
    </div>
  );
}
