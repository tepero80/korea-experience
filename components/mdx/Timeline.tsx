interface TimelineItem {
  time?: string;
  title: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

export default function Timeline({ items, title }: TimelineProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500" />
        
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Icon/Bullet */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                {item.icon || '📍'}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                {item.time && (
                  <div className="text-sm font-semibold text-blue-600 mb-1">
                    {item.time}
                  </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
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
