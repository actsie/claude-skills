'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SubmitSkillModal from '@/components/SubmitSkillModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Claude Skills Market
              </div>
            </Link>

            {/* CTA Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5E50A0] hover:bg-[#4a3d80] text-white font-medium"
            >
              Submit Skill
            </Button>
          </div>
        </div>
      </nav>

      <SubmitSkillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
