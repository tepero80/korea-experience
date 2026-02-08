'use client';

import { ReactNode, useState } from 'react';

/**
 * ExpertTip Component
 * GEO 최적화: E-E-A-T (전문성, 경험) 강화
 * Deep Research 전략: "AI가 생성할 수 없는 '개인적 경험'과 '주관적 통찰'"
 */

interface ExpertTipProps {
  /** 전문가/작성자 이름 (name 또는 author 사용 가능) */
  name?: string;
  /** 전문가/작성자 이름 (deprecated, name 사용 권장) */
  author?: string;
  /** 전문가 역할/타이틀 */
  role?: string;
  /** 전문가 아바타 이미지 */
  avatar?: string;
  /** 팁 내용 (quote 또는 children 사용 가능) */
  children?: ReactNode;
  /** 팁 내용 (문자열) */
  quote?: string;
  /** 팁 유형 */
  type?: 'local' | 'expert' | 'warning' | 'personal' | 'travel' | 'influencer' | 'editor';
  /** 검증 상태 */
  verified?: boolean;
  /** 경험 년수 */
  experience?: string;
  /** 위치 */
  location?: string;
}

const typeConfig = {
  local: {
    label: 'Local Insider Tip',
    icon: '🏠',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    border: 'border-cyan-200',
  },
  expert: {
    label: 'Expert Advice',
    icon: '🎓',
    gradient: 'from-purple-500 to-indigo-500',
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    border: 'border-purple-200',
  },
  warning: {
    label: 'Heads Up',
    icon: '⚠️',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  personal: {
    label: 'Personal Experience',
    icon: '💬',
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    border: 'border-pink-200',
  },
  travel: {
    label: 'Traveler Tip',
    icon: '✈️',
    gradient: 'from-teal-500 to-emerald-500',
    bg: 'bg-gradient-to-br from-teal-50 to-emerald-50',
    border: 'border-teal-200',
  },
  influencer: {
    label: 'Influencer Insight',
    icon: '📸',
    gradient: 'from-pink-500 to-purple-500',
    bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
    border: 'border-pink-200',
  },
  editor: {
    label: "Editor's Pick",
    icon: '✍️',
    gradient: 'from-blue-600 to-indigo-600',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
};

function AvatarWithFallback({ src, name, gradient }: { src?: string; name: string; gradient: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
      onError={() => setFailed(true)}
    />
  );
}

export default function ExpertTip({
  name,
  author,
  role,
  avatar,
  children,
  quote,
  type = 'expert',
  verified = false,
  experience,
  location,
}: ExpertTipProps) {
  // name 우선, 없으면 author, 둘 다 없으면 기본값
  const displayName = name || author || 'Korea Experience Team';
  // quote 우선, 없으면 children
  const content = quote || children;
  const config = typeConfig[type];
  
  return (
    <div 
      className={`my-8 ${config.bg} rounded-2xl border-2 ${config.border} overflow-hidden shadow-md`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 py-3`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span className="text-white font-bold text-lg">{config.label}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <AvatarWithFallback
              src={avatar}
              name={displayName}
              gradient={config.gradient}
            />
          </div>
          
          {/* Author Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">
                {displayName}
              </span>
              {verified && (
                <span 
                  className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                  title="Verified Local Expert"
                >
                  ✓ Verified
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
              {role && <span>{role}</span>}
              {experience && (
                <span className="flex items-center gap-1">
                  <span>📅</span> {experience}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <span>📍</span> {location}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tip Content */}
        <div className="relative pl-5 border-l-4 border-gray-300">
          <span className="absolute -left-3 -top-2 text-4xl text-gray-300 font-serif">"</span>
          <div className="text-gray-700 leading-relaxed italic">
            {typeof content === 'string' ? (
              <p className="m-0">{content}</p>
            ) : (
              content
            )}
          </div>
        </div>
        
        {/* Trust Signal */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Based on first-hand experience
          </span>
          <span className="text-gray-300">|</span>
          <span>E-E-A-T verified content</span>
        </div>
      </div>
    </div>
  );
}
