'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

// Helper to extract text from React children recursively
const extractText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return children.toString();
  if (!children) return '';
  
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  
  if (children.props && children.props.children) {
    return extractText(children.props.children);
  }
  
  return '';
};

export default function ResponsiveTable({ children, ...props }: ResponsiveTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract table data
  const extractTableData = () => {
    const childArray = Array.isArray(children) ? children : [children];
    let headers: string[] = [];
    let rows: string[][] = [];

    childArray.forEach((child: any) => {
      if (!child || !child.props) return;

      // Extract thead
      if (child.type === 'thead' || child.props?.children?.type === 'thead') {
        const theadContent = child.type === 'thead' ? child : child.props.children;
        const trContent = theadContent?.props?.children;
        const thElements = trContent?.props?.children;
        
        if (Array.isArray(thElements)) {
          headers = thElements.map((th: any) => extractText(th));
        } else if (thElements) {
          headers = [extractText(thElements)];
        }
      }

      // Extract tbody
      if (child.type === 'tbody' || child.props?.children?.type === 'tbody') {
        const tbodyContent = child.type === 'tbody' ? child : child.props.children;
        const trElements = tbodyContent?.props?.children;

        if (Array.isArray(trElements)) {
          rows = trElements.map((tr: any) => {
            if (!tr || !tr.props) return [];
            const tdElements = tr.props.children;
            
            if (Array.isArray(tdElements)) {
              return tdElements.map((td: any) => extractText(td));
            } else if (tdElements) {
              return [extractText(tdElements)];
            }
            return [];
          }).filter(row => row.length > 0);
        }
      }
    });

    return { headers, rows };
  };

  const { headers, rows } = extractTableData();

  // Mobile card layout
  if (isMobile && headers.length > 0 && rows.length > 0) {
    return (
      <div className="my-8 space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            {/* Blue gradient header bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-800 to-blue-600" />
            
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                  cellIndex === 0 
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50' 
                    : cellIndex % 2 === 0 
                      ? 'bg-gray-50' 
                      : 'bg-white'
                }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5 ${
                  cellIndex === 0 ? 'text-blue-900' : 'text-blue-700'
                }`}>
                  {cellIndex === 0 && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {headers[cellIndex]}
                </div>
                <div className={`text-sm whitespace-pre-wrap ${
                  cellIndex === 0 
                    ? 'text-gray-900 font-semibold' 
                    : 'text-gray-700'
                }`}>
                  {cell}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-300" {...props}>
        {children}
      </table>
    </div>
  );
}
