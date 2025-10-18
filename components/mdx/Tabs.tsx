'use client';

import { useState, ReactNode } from 'react';

interface TabsProps {
  items: string[];
  children: ReactNode;
}

export default function Tabs({ items, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Split children by tab
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === index
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {childArray[activeTab]}
      </div>
    </div>
  );
}
