'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Skill } from '@/lib/types';
import TableOfContents from './TableOfContents';

interface SkillDetailClientProps {
  skill: Skill;
  relatedSkills: Skill[];
  children: ReactNode;
}

export default function SkillDetailClient({ skill, relatedSkills, children }: SkillDetailClientProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter related skills by matching tags
  const skillsByTags = relatedSkills.filter(relatedSkill => {
    if (!skill.tags || !relatedSkill.tags) return false;
    return skill.tags.some(tag => relatedSkill.tags.includes(tag));
  }).slice(0, 5); // Limit to 5 related skills

  // Get the first tag for the "View More" link
  const firstTag = skill.tags && skill.tags.length > 0 ? skill.tags[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Breadcrumbs */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumbs */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Skills
                </Link>
              </li>
              {skill.categories && skill.categories[0] && (
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Link
                      href={`/?category=${skill.categories[0]}`}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 md:ml-2"
                    >
                      {skill.categories[0]}
                    </Link>
                  </div>
                </li>
              )}
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                    {skill.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Title with optional logo */}
          <div className="flex items-start gap-4">
            {skill.logo && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <Image
                    src={skill.logo}
                    alt={`${skill.title} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {skill.title}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                {skill.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {skill.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                )}
                {skill.categories.map((category) => (
                  <Link
                    key={category}
                    href={`/?category=${category}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main content with right sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 lg:p-12">
              <div className="max-w-none">
                {children}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Table of Contents - Only show if content exists */}
            <TableOfContents />

            {/* GitHub Link Panel - Always visible */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Repository
              </div>
              {skill.repoUrl ? (
                <a
                  href={skill.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 font-medium text-sm cursor-not-allowed">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Add GitHub Link
                </div>
              )}
            </div>

            {/* Related Skills Panel */}
            {skillsByTags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                  Related Skills
                </div>
                <div className="space-y-3">
                  {skillsByTags.map((relatedSkill) => (
                    <Link
                      key={relatedSkill.slug}
                      href={`/skills/${relatedSkill.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {relatedSkill.logo && (
                          <div className="w-10 h-10 relative rounded overflow-hidden bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                            <Image
                              src={relatedSkill.logo}
                              alt=""
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                            {relatedSkill.title}
                          </p>
                          {relatedSkill.categories && relatedSkill.categories[0] && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {relatedSkill.categories[0]}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View More Link */}
                {firstTag && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/?tags=${firstTag}`}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      View More
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
