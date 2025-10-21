/**
 * PostHog client initialization
 * Direct client-side tracking with automatic event capture
 */

import posthog from 'posthog-js';
import { hasAnalyticsConsent } from './consent';

let isInitialized = false;

export function initPostHog(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isInitialized) {
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    console.warn('PostHog configuration missing. Analytics disabled.');
    return;
  }

  // Only init if consent is given (or not required in dev)
  const hasConsent = hasAnalyticsConsent();
  const isDev = process.env.NODE_ENV === 'development';

  if (!hasConsent && !isDev) {
    console.log('PostHog not initialized - waiting for analytics consent');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture: false, // Manual event tracking only
    capture_pageview: true, // Auto-capture page views
    capture_pageleave: true,
    disable_session_recording: true, // Privacy: no session recording
    loaded: (ph) => {
      // Disable in development if needed
      if (isDev) {
        ph.opt_out_capturing(); // Opt out in dev to avoid polluting data
        console.log('PostHog initialized in dev mode (capturing disabled)');
      } else {
        console.log('PostHog initialized');
      }
    },
  });

  isInitialized = true;
}

/**
 * Get PostHog instance
 */
export function getPostHog() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isInitialized) {
    initPostHog();
  }

  return posthog;
}

/**
 * Opt-in to PostHog tracking after consent is given
 */
export function enablePostHogTracking(): void {
  const ph = getPostHog();
  if (ph) {
    ph.opt_in_capturing();
    console.log('PostHog tracking enabled');
  }
}

/**
 * Opt-out of PostHog tracking
 */
export function disablePostHogTracking(): void {
  const ph = getPostHog();
  if (ph) {
    ph.opt_out_capturing();
    console.log('PostHog tracking disabled');
  }
}
