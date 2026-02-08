import { renderInlineMarkdown } from './utils';

interface TimelineItem {
  time?: string;
  year?: string;
  title?: string;
  event?: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  items?: TimelineItem[];
  events?: TimelineItem[];
  title?: string;
}

export default function Timeline({ items, events, title }: TimelineProps) {
  const data = items ?? events ?? [];
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-300" />
        
        <div className="space-y-8">
          {data.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Icon/Bullet */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                {item.icon || '📍'}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                {(item.time || item.year) && (
                  <div className="text-sm font-semibold text-amber-700 mb-1">
                    {item.time || item.year}
                  </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title || item.event}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {renderInlineMarkdown(item.description)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
