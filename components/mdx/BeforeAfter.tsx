'use client';

import { useState } from 'react';

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
}

export default function BeforeAfter({ 
  before, 
  after, 
  beforeLabel = 'Before',
  afterLabel = 'After',
  caption 
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    let x: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }
    
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="my-8">
      <div
        className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-lg shadow-xl cursor-ew-resize select-none border-4 border-gray-200"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* After Image (Full) */}
        <img
          src={after}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        
        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={before}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${10000 / sliderPosition}%` }}
            draggable="false"
          />
        </div>
        
        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-blue-500">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {afterLabel}
        </div>
      </div>
      
      {caption && (
        <p className="text-center text-gray-600 mt-4 italic">{caption}</p>
      )}
    </div>
  );
}
