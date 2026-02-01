'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Get all h2 and h3 headings from the article
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TOCItem[] = Array.from(elements).map((elem) => ({
      id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: elem.textContent || '',
      level: parseInt(elem.tagName.substring(1)),
    }));

    setHeadings(items);

    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`
                text-sm hover:text-blue-600 transition-colors
                ${activeId === heading.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
