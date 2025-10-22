'use client';

interface VoteButtonsProps {
  userVote: 'helpful' | 'not_helpful' | null;
  userSaved: boolean;
  onVote: (voteType: 'helpful' | 'not_helpful') => void;
  onSaveToggle: () => void;
}

export default function VoteButtons({
  userVote,
  userSaved,
  onVote,
  onSaveToggle,
}: VoteButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Helpful button */}
      <button
        onClick={() => onVote('helpful')}
        disabled={userVote !== null}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all ${
          userVote === 'helpful'
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
            : userVote === null
            ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
        }`}
        title="Helpful (improves ranking)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      </button>

      {/* Not helpful button */}
      <button
        onClick={() => onVote('not_helpful')}
        disabled={userVote !== null}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all ${
          userVote === 'not_helpful'
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm'
            : userVote === null
            ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
        }`}
        title="Not helpful (help us improve)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
      </button>

      {/* Save button with tooltip */}
      <div className="relative inline-block group">
        <button
          onClick={onSaveToggle}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all ${
            userSaved
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {userSaved ? (
            // Filled bookmark
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          ) : (
            // Outline bookmark
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 z-50 pointer-events-none">
          <div className="relative p-3 bg-gray-900 dark:bg-gray-700 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-400">
                  <path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white">Save for Later</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Find your saved skills in the filter menu
            </p>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-50 pointer-events-none"></div>

            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 border-r border-b border-white/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
