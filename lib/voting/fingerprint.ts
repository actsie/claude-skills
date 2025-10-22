import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FINGERPRINT_CACHE_KEY = 'fp_visitor_id';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface FingerprintCache {
  visitorId: string;
  timestamp: number;
}

/**
 * Get browser fingerprint for anonymous user tracking
 * Uses localStorage to cache the fingerprint for 24 hours
 */
export async function getFingerprint(): Promise<string> {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(FINGERPRINT_CACHE_KEY);
      if (cached) {
        const parsed: FingerprintCache = JSON.parse(cached);
        const now = Date.now();

        // Return cached fingerprint if still valid
        if (now - parsed.timestamp < CACHE_DURATION) {
          return parsed.visitorId;
        }
      }
    } catch (err) {
      console.error('[Fingerprint] Cache read error:', err);
    }
  }

  // Generate new fingerprint
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;

    // Cache in localStorage
    if (typeof window !== 'undefined') {
      try {
        const cacheData: FingerprintCache = {
          visitorId,
          timestamp: Date.now(),
        };
        localStorage.setItem(FINGERPRINT_CACHE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        console.error('[Fingerprint] Cache write error:', err);
      }
    }

    return visitorId;
  } catch (err) {
    console.error('[Fingerprint] Generation error:', err);
    // Fallback to a random ID if fingerprinting fails
    return `fallback_${Math.random().toString(36).substring(2)}`;
  }
}

/**
 * Hash fingerprint for privacy (use server-side for Discord webhooks)
 */
export function hashFingerprint(fingerprint: string): string {
  // Simple hash for privacy - first 8 chars of base64
  if (typeof window !== 'undefined') {
    return fingerprint.substring(0, 8);
  }

  // Server-side: use built-in crypto if available
  if (typeof Buffer !== 'undefined') {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(fingerprint)
      .digest('hex')
      .substring(0, 12);
  }

  return fingerprint.substring(0, 8);
}
