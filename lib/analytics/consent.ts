/**
 * Consent management for analytics tracking
 * Stores user consent preferences in localStorage
 */

const CONSENT_KEY = 'analytics_consent';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/**
 * Get current consent state
 */
export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const consentStr = localStorage.getItem(CONSENT_KEY);
    if (!consentStr) {
      return null;
    }

    return JSON.parse(consentStr) as ConsentState;
  } catch {
    return null;
  }
}

/**
 * Save consent preferences
 */
export function setConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const consentState: ConsentState = {
      analytics,
      marketing,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentState));

    // Dispatch custom event for Analytics component to listen to
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: consentState }));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Check if user has given analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics === true;
}

/**
 * Check if user has given marketing consent (for GA4)
 */
export function hasMarketingConsent(): boolean {
  const consent = getConsent();
  return consent?.marketing === true;
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const consent = getConsent();
  return consent === null; // Show if no consent has been recorded
}

/**
 * Reset consent (for testing or user-initiated deletion)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: null }));
  } catch {
    // Silently fail
  }
}
