/**
 * Session management for analytics
 * Generates and persists a session ID in sessionStorage
 */

const SESSION_ID_KEY = 'analytics_session_id';
const LAST_EVENT_KEY = 'analytics_last_event';

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    return sessionId;
  } catch {
    // Fallback if sessionStorage is not available
    return 'fallback-' + Date.now();
  }
}

interface LastEvent {
  name: string;
  timestamp: number;
  properties: Record<string, any>;
}

/**
 * Check if an event is a duplicate (same event within 2 seconds)
 * Used to prevent double-firing from React strict mode or rapid clicks
 */
export function isDuplicateEvent(
  eventName: string,
  properties: Record<string, any>
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const lastEventStr = sessionStorage.getItem(LAST_EVENT_KEY);
    if (!lastEventStr) {
      return false;
    }

    const lastEvent: LastEvent = JSON.parse(lastEventStr);
    const now = Date.now();

    // Check if same event within 2 seconds
    if (
      lastEvent.name === eventName &&
      now - lastEvent.timestamp < 2000
    ) {
      // Additional check: compare key properties
      const propsMatch = JSON.stringify(properties) === JSON.stringify(lastEvent.properties);
      if (propsMatch) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Store the last event to enable deduplication
 */
export function recordLastEvent(
  eventName: string,
  properties: Record<string, any>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const lastEvent: LastEvent = {
      name: eventName,
      timestamp: Date.now(),
      properties,
    };
    sessionStorage.setItem(LAST_EVENT_KEY, JSON.stringify(lastEvent));
  } catch {
    // Silently fail if sessionStorage is not available
  }
}
