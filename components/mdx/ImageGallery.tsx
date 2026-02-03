'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  columns?: number;
}

export default function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 my-8`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="max-w-6xl max-h-[90vh] relative">
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            {images[selectedImage].caption && (
              <div className="text-center text-white mt-4 text-lg">
                {images[selectedImage].caption}
              </div>
            )}
          </div>
          {selectedImage > 0 && (
            <button
              className="absolute left-4 text-white text-6xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
            >
              ‹
            </button>
          )}
          {selectedImage < images.length - 1 && (
            <button
              className="absolute right-4 text-white text-6xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
