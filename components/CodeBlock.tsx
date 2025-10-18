'use client';

import React from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  title?: string;
  showHeader?: boolean;
}

export default function CodeBlock({ 
  children, 
  language = 'text', 
  title,
  showHeader = true 
}: CodeBlockProps) {
  const displayTitle = title || (language === 'text' ? '' : language.toUpperCase());

  return (
    <div className="max-w-full bg-[#1d1e22] shadow-[0px_4px_15px_rgba(0,0,0,0.2)] rounded-lg p-0.5 my-4">
      {showHeader && (
        <div className="flex items-center justify-between mx-2.5 my-2.5">
          <span className="font-lato font-black text-sm tracking-[1.57px] text-gray-300">
            {displayTitle}
          </span>
        </div>
      )}
      <div className="mx-2.5 mb-2.5 text-white overflow-x-auto">
        <pre className="!bg-transparent !border-none !p-0 !m-0">
          <code className="!bg-transparent !p-0 text-sm leading-relaxed">
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}