'use client';

import { useState, useEffect } from 'react';
import { shouldShowConsentBanner, setConsent, getConsent } from '@/lib/analytics/consent';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    setShowBanner(shouldShowConsentBanner());
  }, []);

  const handleAcceptAll = () => {
    setConsent(true, true);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    setConsent(false, false);
    setShowBanner(false);
  };

  const handleSavePreferences = (analytics: boolean, marketing: boolean) => {
    setConsent(analytics, marketing);
    setShowBanner(false);
    setShowDetails(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto">
        {!showDetails ? (
          /* Simple Banner */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                🍪 We use cookies
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We use cookies to improve your experience and analyze site usage. You can choose which cookies to accept.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Preferences */
          <CookiePreferencesForm
            onSave={handleSavePreferences}
            onCancel={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  );
}

function CookiePreferencesForm({
  onSave,
  onCancel,
}: {
  onSave: (analytics: boolean, marketing: boolean) => void;
  onCancel: () => void;
}) {
  const consent = getConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? true);
  const [marketing, setMarketing] = useState(consent?.marketing ?? true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Cookie Preferences
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Essential Cookies - Always enabled */}
        <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex-1">
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
              Essential Cookies
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Required for the website to function properly.
            </p>
          </div>
          <div className="ml-4 text-xs font-medium text-gray-500">
            Always Active
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex-1">
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
              Analytics Cookies
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Help us understand how you use the site (PostHog).
            </p>
          </div>
          <label className="ml-4 relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex-1">
            <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
              Marketing Cookies
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Track traffic sources and campaigns (Google Analytics).
            </p>
          </div>
          <label className="ml-4 relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(analytics, marketing)}
          className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-sm"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
