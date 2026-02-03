'use client';

import { ShareButtons } from '../ShareButtons';

interface GeneratorResultProps {
  emoji: string;
  mainResult: {
    primary: string;
    secondary?: string;
    pronunciation?: string;
  };
  variations?: Array<{
    label: string;
    value: string;
  }>;
  meaning?: {
    title: string;
    description: string;
  };
  shareConfig: {
    toolSlug: string;
    shareText: string | ((result: any) => string);
    result?: any;
  };
  onReset: () => void;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

export function GeneratorResult({ 
  emoji,
  mainResult,
  variations,
  meaning,
  shareConfig,
  onReset,
  onRegenerate,
  onDownload
}: GeneratorResultProps) {
  return (
    <div className="result-card">
      <div className="result-header">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800">{mainResult.primary}</h2>
        {mainResult.secondary && (
          <h3 className="text-2xl text-gray-600 mt-2">{mainResult.secondary}</h3>
        )}
        {mainResult.pronunciation && (
          <p className="text-lg text-gray-500 mt-2">[{mainResult.pronunciation}]</p>
        )}
      </div>

      {meaning && (
        <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <h3 className="text-xl font-bold text-purple-700 mb-2">{meaning.title}</h3>
          <p className="text-gray-700 leading-relaxed">{meaning.description}</p>
        </div>
      )}

      {variations && variations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Other Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.map((v, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-600 font-medium">{v.label}</span>
                <span className="block text-lg font-bold text-gray-800 mt-1">{v.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개별 영역: 툴별 특화 액션 */}
      {onRegenerate && (
        <div className="mt-8">
          <button 
            onClick={onRegenerate}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
          >
            🔄 Regenerate
          </button>
        </div>
      )}

      {/* 구분선 */}
      <div className="mt-8 mb-6 border-t border-gray-200"></div>

      {/* 공통 영역: SNS 공유 + 기본 액션 */}
      <div className="space-y-4">
        <ShareButtons {...shareConfig} />
        
        <div className="flex flex-wrap gap-3 justify-center">
          {onDownload && (
            <button 
              onClick={onDownload}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
            >
              💾 Download Image
            </button>
          )}
          
          <button 
            onClick={onReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            🔙 Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
