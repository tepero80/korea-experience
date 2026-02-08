'use client';

import { ReactNode } from 'react';
import { renderInlineMarkdown } from './utils';

/**
 * InfoBox Component
 * GEO 최적화: 구조화된 정보 박스 (팁, 경고, 성공, 정보)
 * 시각적 차별화를 통해 중요 정보 강조
 */

type InfoType = 'tip' | 'warning' | 'success' | 'info' | 'danger' | 'note' | 'arc-free';

interface InfoBoxProps {
  /** 박스 타입 */
  type?: InfoType;
  /** 제목 (선택) */
  title?: string;
  /** 내용 */
  children?: ReactNode;
  /** 텍스트 내용 (children 대체) */
  text?: string;
  /** 이모지 오버라이드 */
  icon?: string;
}

const typeConfig: Record<InfoType, { 
  gradient: string; 
  border: string; 
  bg: string;
  icon: string; 
  defaultTitle: string;
  iconBg: string;
}> = {
  tip: {
    gradient: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-300',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    icon: '💡',
    defaultTitle: 'Pro Tip',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  warning: {
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    icon: '⚠️',
    defaultTitle: 'Important Warning',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  success: {
    gradient: 'from-green-500 to-emerald-500',
    border: 'border-green-300',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    icon: '✅',
    defaultTitle: 'Success',
    iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
  },
  info: {
    gradient: 'from-stone-500 to-stone-600',
    border: 'border-stone-300',
    bg: 'bg-gradient-to-br from-stone-50 to-stone-100',
    icon: 'ℹ️',
    defaultTitle: 'Good to Know',
    iconBg: 'bg-gradient-to-br from-stone-400 to-stone-500',
  },
  danger: {
    gradient: 'from-red-500 to-rose-500',
    border: 'border-red-300',
    bg: 'bg-gradient-to-br from-red-50 to-rose-50',
    icon: '🚨',
    defaultTitle: 'Critical Alert',
    iconBg: 'bg-gradient-to-br from-red-400 to-rose-500',
  },
  note: {
    gradient: 'from-stone-500 to-stone-600',
    border: 'border-stone-300',
    bg: 'bg-gradient-to-br from-stone-50 to-stone-100',
    icon: '📝',
    defaultTitle: 'Note',
    iconBg: 'bg-gradient-to-br from-stone-400 to-stone-500',
  },
  'arc-free': {
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    icon: '🌏',
    defaultTitle: 'ARC-Free Solution',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
};

export default function InfoBox({ type, title, children, text, icon }: InfoBoxProps) {
  const resolvedType = type ?? (title?.toLowerCase().includes('warning') ? 'warning' : 'info');
  const config = typeConfig[resolvedType];
  const content = children ?? text;
  
  return (
    <div 
      className={`my-8 rounded-xl border-2 ${config.border} ${config.bg} overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300`}
      role="note"
      aria-label={title || config.defaultTitle}
    >
      {/* Header */}
      <div className={`px-5 py-3 bg-gradient-to-r ${config.gradient}`}>
        <div className="flex items-center gap-3">
          <span 
            className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center text-xl shadow-md`}
          >
            {icon || config.icon}
          </span>
          <h4 className="text-lg font-bold text-white m-0 p-0 border-none">
            {title || config.defaultTitle}
          </h4>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 text-gray-700 leading-relaxed">
        {typeof content === 'string' ? (
          <div className="m-0 text-base whitespace-pre-line">{renderInlineMarkdown(content)}</div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
