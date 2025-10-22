'use client';

import { useState, useEffect } from 'react';
import { getFingerprint } from '@/lib/voting/fingerprint';
import { formatNumber } from '@/lib/voting/validation';
import type { SkillMetrics, UserSkillState } from '@/lib/types';
import VoteButtons from './VoteButtons';
import FeedbackChips from './FeedbackChips';

interface TrustActionsProps {
  skillId: string;
  skillTitle: string;
}

export default function TrustActions({ skillId, skillTitle }: TrustActionsProps) {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SkillMetrics>({
    views: 0,
    helpful: 0,
    not_helpful: 0,
    saves: 0,
  });
  const [userState, setUserState] = useState<UserSkillState>({
    vote: null,
    saved: false,
  });
  const [showFeedbackChips, setShowFeedbackChips] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get fingerprint on mount
  useEffect(() => {
    getFingerprint().then(setFingerprint);
  }, []);

  // Fetch initial metrics
  useEffect(() => {
    if (!fingerprint) return;

    fetch(`/api/skills/${skillId}/metrics?fingerprint=${fingerprint}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics(data.metrics);
        }
        if (data.userState) {
          setUserState(data.userState);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch metrics:', err);
        setLoading(false);
      });
  }, [skillId, fingerprint]);

  // Handle vote
  const handleVote = async (voteType: 'helpful' | 'not_helpful') => {
    if (!fingerprint || userState.vote) return;

    // Show feedback chips for not_helpful
    if (voteType === 'not_helpful') {
      setShowFeedbackChips(true);
      return;
    }

    // Optimistic update
    setUserState({ ...userState, vote: voteType });
    setMetrics({
      ...metrics,
      [voteType]: metrics[voteType] + 1,
    });

    try {
      const response = await fetch(`/api/skills/${skillId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprint,
          voteType,
          skillTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Vote failed');
      }

      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Vote error:', err);
      // Rollback on error
      setUserState({ ...userState, vote: null });
      setMetrics({
        ...metrics,
        [voteType]: Math.max(0, metrics[voteType] - 1),
      });
    }
  };

  // Handle feedback submission (not_helpful with reason)
  const handleFeedbackSubmit = async (reason: string, note?: string) => {
    if (!fingerprint) return;

    // Optimistic update
    setUserState({ ...userState, vote: 'not_helpful' });
    setMetrics({
      ...metrics,
      not_helpful: metrics.not_helpful + 1,
    });
    setShowFeedbackChips(false);

    try {
      const response = await fetch(`/api/skills/${skillId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprint,
          voteType: 'not_helpful',
          reason,
          note,
          skillTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Feedback failed');
      }

      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Feedback error:', err);
      // Rollback on error
      setUserState({ ...userState, vote: null });
      setMetrics({
        ...metrics,
        not_helpful: Math.max(0, metrics.not_helpful - 1),
      });
      setShowFeedbackChips(true);
    }
  };

  // Handle save toggle
  const handleSaveToggle = async () => {
    if (!fingerprint) return;

    // Get current saved state from localStorage
    const savedSkills = JSON.parse(localStorage.getItem('saved_skills') || '[]');
    const isSaved = savedSkills.includes(skillId);

    // Optimistic update
    const newSavedState = !isSaved;
    setUserState({ ...userState, saved: newSavedState });
    setMetrics({
      ...metrics,
      saves: newSavedState ? metrics.saves + 1 : Math.max(0, metrics.saves - 1),
    });

    // Update localStorage
    if (newSavedState) {
      localStorage.setItem('saved_skills', JSON.stringify([...savedSkills, skillId]));
    } else {
      localStorage.setItem(
        'saved_skills',
        JSON.stringify(savedSkills.filter((id: string) => id !== skillId))
      );
    }

    try {
      const response = await fetch(`/api/skills/${skillId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      const data = await response.json();
      setUserState({ ...userState, saved: data.saved });
      setMetrics({ ...metrics, saves: data.saveCount });
    } catch (err) {
      console.error('Save error:', err);
      // Rollback on error
      setUserState({ ...userState, saved: isSaved });
      setMetrics({
        ...metrics,
        saves: isSaved ? metrics.saves + 1 : Math.max(0, metrics.saves - 1),
      });
      // Rollback localStorage
      if (isSaved) {
        localStorage.setItem('saved_skills', JSON.stringify([...savedSkills, skillId]));
      } else {
        localStorage.setItem(
          'saved_skills',
          JSON.stringify(savedSkills.filter((id: string) => id !== skillId))
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-64">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
        Trust & Actions
      </div>

      {/* Primary row - icon buttons */}
      <VoteButtons
        userVote={userState.vote}
        userSaved={userState.saved}
        onVote={handleVote}
        onSaveToggle={handleSaveToggle}
      />

      {/* Feedback chips (only shown after clicking not_helpful) */}
      {showFeedbackChips && (
        <FeedbackChips
          onSubmit={handleFeedbackSubmit}
          onCancel={() => setShowFeedbackChips(false)}
        />
      )}

      {/* Secondary row - stats */}
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-4">
        {/* Views */}
        <span className="flex items-center gap-1" title="Unique views (30 days)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {metrics ? formatNumber(metrics.views) : 'New'}
        </span>

        <span className="text-gray-300 dark:text-gray-600">·</span>

        {/* Helpful */}
        <span className="flex items-center gap-1" title="Helpful votes">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {metrics ? formatNumber(metrics.helpful) : 'New'}
        </span>

        <span className="text-gray-300 dark:text-gray-600">·</span>

        {/* Not helpful */}
        <span className="flex items-center gap-1" title="Not helpful votes">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
            />
          </svg>
          {metrics ? formatNumber(metrics.not_helpful) : 'New'}
        </span>
      </div>

      {/* Subtext */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Signal quality and save for later
      </p>
    </div>
  );
}
