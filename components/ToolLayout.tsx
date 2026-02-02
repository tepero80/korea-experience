import Link from 'next/link';
import { ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  emoji: string;
  gradient?: string;
}

export default function ToolLayout({ 
  children, 
  title, 
  description, 
  emoji,
  gradient = 'from-purple-600 via-pink-600 to-purple-700'
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back to Tools Link - 항상 표시 */}
        <Link 
          href="/tools"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header - 모든 툴에 동일한 스타일 */}
          <div className={`bg-gradient-to-r ${gradient} text-white px-8 py-12 text-center`}>
            <div className="text-5xl mb-4">{emoji}</div>
            <h1 className="text-4xl font-bold mb-3">{title}</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
