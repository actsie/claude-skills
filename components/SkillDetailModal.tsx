'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Skill } from '@/lib/types';
import { getCategoryColor, formatLastUpdated } from '@/lib/skillUtils';
import { isVerifiedAuthor } from '@/lib/utils/verification';
import VerifiedBadge from '@/components/VerifiedBadge';

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillDetailModal({ skill, isOpen, onClose }: SkillDetailModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !skill) return null;

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/skills/${skill.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      // TODO: Show toast notification
      console.log('Link copied!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4 pr-10">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
              <span className="text-2xl font-bold text-white">
                {skill.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {skill.title}
              </h2>
              {skill.oneLiner && (
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {skill.oneLiner}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Categories */}
          {skill.categories && skill.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.categories.map((category) => (
                  <span
                    key={category}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${getCategoryColor(category)}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {skill.author && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Author</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  {skill.author}
                  {isVerifiedAuthor(skill.repoUrl) && (
                    <VerifiedBadge size="sm" />
                  )}
                </p>
              </div>
            )}
            {skill.version && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Version</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{skill.version}</p>
              </div>
            )}
            {(skill.lastUpdated || skill.date) && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatLastUpdated(skill.lastUpdated || skill.date || '')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex gap-3">
            <Link
              href={`/skills/${skill.slug}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Full Details
            </Link>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
