/**
 * Event tracking functions for analytics
 * Client-side direct tracking to PostHog with deduplication
 */

import { getPostHog } from './posthog';
import { getSessionId, isDuplicateEvent, recordLastEvent } from './session';
import { hasAnalyticsConsent } from './consent';
import type {
  BaseEventProperties,
  FilterProperties,
  SkillProperties,
  PageType,
  SurfaceType,
} from './types';
import type { Skill } from '../types';

const SCHEMA_VERSION = 1;

/**
 * Get base event properties included in all events
 */
function getBaseProperties(
  page: PageType,
  surface: SurfaceType
): BaseEventProperties {
  return {
    page,
    surface,
    session_id: getSessionId(),
    schema_version: SCHEMA_VERSION,
    consent_given: hasAnalyticsConsent(),
  };
}

/**
 * Extract skill properties from a Skill object
 */
function getSkillProperties(skill: Partial<Skill>): SkillProperties {
  return {
    skill_id: skill.slug || '',
    title: skill.title || '',
    category: skill.categories?.[0] || '',
    tags: skill.tags?.slice(0, 3) || [],
    created_at: skill.date,
  };
}

/**
 * Track event to PostHog (client-side) with deduplication
 */
function trackEvent(eventName: string, properties: Record<string, any>): void {
  // Check if this is a duplicate event
  if (isDuplicateEvent(eventName, properties)) {
    console.log(`[Analytics] Duplicate event prevented: ${eventName}`);
    return;
  }

  // Check consent
  if (!hasAnalyticsConsent()) {
    console.log(`[Analytics] Event not tracked (no consent): ${eventName}`);
    return;
  }

  // Track to PostHog
  const ph = getPostHog();
  if (ph) {
    ph.capture(eventName, properties);
    console.log(`[Analytics] Event tracked: ${eventName}`, properties);
  }

  // Record for deduplication
  recordLastEvent(eventName, properties);

  // Fallback: send to server API for ad-blocker scenarios
  // This also increments KV counters for trending computation
  sendToServerFallback(eventName, properties).catch((err) => {
    console.warn('[Analytics] Server fallback failed:', err);
  });
}

/**
 * Send event to server fallback API (for ad-blockers and KV counters)
 */
async function sendToServerFallback(
  eventName: string,
  properties: Record<string, any>
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: [{ name: eventName, properties }],
      }),
      // Use keepalive for events triggered during page unload
      keepalive: true,
    });
  } catch (error) {
    // Silently fail - PostHog is primary tracking method
    throw error;
  }
}

/**
 * Track catalog view (skills grid rendered with current filters)
 */
export function trackCatalogView(
  filters: FilterProperties,
  resultCount: number
): void {
  trackEvent('catalog_view', {
    ...getBaseProperties('home', 'catalog_grid'),
    filters,
    result_count: resultCount,
  });
}

/**
 * Track filter application (user applies category/tags/sort)
 */
export function trackFilterApply(
  filterType: 'category' | 'tag' | 'sort' | 'clear',
  filterValue: string,
  filters: FilterProperties,
  resultCount: number
): void {
  trackEvent('filter_apply', {
    ...getBaseProperties('home', 'catalog_grid'),
    filter_type: filterType,
    filter_value: filterValue,
    filters,
    result_count: resultCount,
  });
}

/**
 * Track search submission (user runs a search)
 */
export function trackSearchSubmit(
  searchQuery: string,
  filters: FilterProperties,
  resultCount: number
): void {
  // Sanitize search query (remove PII, limit length)
  const sanitizedQuery = searchQuery.trim().toLowerCase().slice(0, 100);

  trackEvent('search_submit', {
    ...getBaseProperties('home', 'catalog_grid'),
    search_query: sanitizedQuery,
    filters,
    result_count: resultCount,
  });
}

/**
 * Track skill detail view (user opens a skill detail page or card)
 */
export function trackSkillDetailView(
  skill: Partial<Skill>,
  surface: SurfaceType,
  position?: number
): void {
  const page: PageType = surface === 'skill_detail' ? 'skill_detail' : 'home';

  trackEvent('skill_detail_view', {
    ...getBaseProperties(page, surface),
    ...getSkillProperties(skill),
    ...(position !== undefined && { position }),
  });
}

/**
 * Track GitHub link click (user clicks the GitHub link in skill detail)
 */
export function trackGitHubLinkClick(
  skill: Partial<Skill>,
  surface: SurfaceType,
  repoUrl: string
): void {
  const page: PageType = surface === 'skill_detail' ? 'skill_detail' : 'home';

  try {
    const url = new URL(repoUrl);
    trackEvent('github_link_click', {
      ...getBaseProperties(page, surface),
      ...getSkillProperties(skill),
      outbound_domain: url.hostname,
      destination_path: url.pathname,
    });
  } catch {
    // Invalid URL, skip tracking
    console.warn(`[Analytics] Invalid GitHub URL: ${repoUrl}`);
  }
}

/**
 * Track tag click (user clicks a tag anywhere)
 */
export function trackTagClick(
  tag: string,
  surface: SurfaceType,
  skillId?: string
): void {
  trackEvent('tag_click', {
    ...getBaseProperties('home', surface),
    tag,
    ...(skillId && { skill_id: skillId }),
  });
}

/**
 * Track home section impression (when a section becomes visible)
 * Uses IntersectionObserver in component
 */
export function trackHomeSectionImpression(
  section: 'trending' | 'featured' | 'newest',
  skillCount: number
): void {
  trackEvent('home_section_impression', {
    ...getBaseProperties('home', section as SurfaceType),
    section,
    skill_count: skillCount,
  });
}
