'use client';

import { useState } from 'react';
import { VOTE_REASONS } from '@/lib/voting/validation';

interface FeedbackChipsProps {
  onSubmit: (reason: string, note?: string) => void;
  onCancel: () => void;
}

export default function FeedbackChips({ onSubmit, onCancel }: FeedbackChipsProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);

    // Show note input for "Other" or if user wants to add details
    if (reason === 'Other') {
      setShowNoteInput(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, note.trim() || undefined);
  };

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
        What went wrong?
      </p>

      {/* Reason chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {VOTE_REASONS.not_helpful.map((reason) => (
          <button
            key={reason}
            onClick={() => handleReasonClick(reason)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedReason === reason
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-500'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10'
            }`}
          >
            {reason}
          </button>
        ))}
      </div>

      {/* Optional note input */}
      {(showNoteInput || selectedReason === 'Other') && (
        <div className="mb-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell us more (optional, max 500 chars)"
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {note.length}/500 characters
          </p>
        </div>
      )}

      {/* Toggle note input */}
      {!showNoteInput && selectedReason && selectedReason !== 'Other' && (
        <button
          onClick={() => setShowNoteInput(true)}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline mb-3"
        >
          + Add details (optional)
        </button>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedReason
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
