# Event Dictionary

This document describes all analytics events tracked in the Claude Skills Market application.

## Schema Version

Current schema version: `1`

All events include a `schema_version` property to track the event structure version for backward compatibility.

---

## Event Overview

| Event Name | Surface(s) | Description |
|------------|-----------|-------------|
| `catalog_view` | home | User views the skills catalog |
| `filter_apply` | home | User applies or changes filters |
| `search_submit` | home | User performs a search |
| `skill_detail_view` | catalog, featured, trending, newest, related_skills, skill_detail | User views a skill detail page |
| `github_link_click` | catalog, skill_detail | User clicks a GitHub repository link |
| `tag_click` | catalog, skill_detail | User clicks a tag to filter |
| `home_section_impression` | home | User views a homepage section (featured/trending/newest) |

---

## Base Event Properties

All events include these base properties:

```typescript
{
  page: PageType;              // Current page: 'home' | 'skill_detail'
  surface: SurfaceType;         // UI surface where event occurred
  session_id: string;          // Unique session identifier (UUID)
  schema_version: number;      // Event schema version (currently 1)
  consent_given: boolean;      // Whether user has given analytics consent
}
```

---

## Event Details

### 1. catalog_view

**Fires when:** User views or navigates the skills catalog (including filter/sort changes)

**Surface:** `home`

**Properties:**
```typescript
{
  page: 'home',
  surface: 'home',
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  filters: {
    category?: string,      // Selected category (if any)
    tags?: string[],       // Selected tags (if any)
    sort?: SortOption      // Current sort option
  },
  result_count: number     // Number of skills displayed
}
```

**Example:**
```json
{
  "event": "catalog_view",
  "properties": {
    "page": "home",
    "surface": "home",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "filters": {
      "category": "development",
      "tags": ["typescript", "testing"],
      "sort": "trending"
    },
    "result_count": 12
  }
}
```

---

### 2. filter_apply

**Fires when:** User applies, changes, or clears filters

**Surface:** `home`

**Properties:**
```typescript
{
  page: 'home',
  surface: 'home',
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  filter_type: 'category' | 'tag' | 'sort' | 'clear',
  filter_value: string,    // The specific value (category name, tag, sort option, 'all')
  filters: {               // Current filter state after this change
    category?: string,
    tags?: string[],
    sort?: SortOption
  },
  result_count: number     // Number of results after filter applied
}
```

**Examples:**

*Applying a category filter:*
```json
{
  "event": "filter_apply",
  "properties": {
    "page": "home",
    "surface": "home",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "filter_type": "category",
    "filter_value": "ai",
    "filters": {
      "category": "ai",
      "sort": "featured"
    },
    "result_count": 8
  }
}
```

*Clearing all filters:*
```json
{
  "event": "filter_apply",
  "properties": {
    "page": "home",
    "surface": "home",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "filter_type": "clear",
    "filter_value": "all",
    "filters": {},
    "result_count": 47
  }
}
```

---

### 3. search_submit

**Fires when:** User enters a search query

**Surface:** `home`

**Properties:**
```typescript
{
  page: 'home',
  surface: 'home',
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  search_query: string,    // The search query entered
  filters: {               // Active filters when search was performed
    category?: string,
    tags?: string[],
    sort?: SortOption
  },
  result_count: number     // Number of search results
}
```

**Example:**
```json
{
  "event": "search_submit",
  "properties": {
    "page": "home",
    "surface": "home",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "search_query": "typescript code review",
    "filters": {
      "category": "development",
      "sort": "relevance"
    },
    "result_count": 3
  }
}
```

---

### 4. skill_detail_view

**Fires when:** User views a skill detail page or clicks to navigate to one

**Surfaces:** `catalog`, `featured`, `trending`, `newest`, `related_skills`, `skill_detail`

**Properties:**
```typescript
{
  page: PageType,          // 'home' or 'skill_detail'
  surface: SurfaceType,    // Where the click/view originated
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  skill_id: string,        // Skill identifier
  skill_slug: string,      // URL slug
  skill_title: string,     // Skill title
  skill_category?: string, // Primary category
  skill_tags?: string[],   // Skill tags
  position?: number        // Position in list (if from a list)
}
```

**Examples:**

*Clicking from catalog:*
```json
{
  "event": "skill_detail_view",
  "properties": {
    "page": "home",
    "surface": "catalog",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "skill_id": "typescript-code-review",
    "skill_slug": "typescript-code-review",
    "skill_title": "TypeScript Code Review",
    "skill_category": "development",
    "skill_tags": ["typescript", "code-review", "security"],
    "position": 2
  }
}
```

*Page load on skill detail:*
```json
{
  "event": "skill_detail_view",
  "properties": {
    "page": "skill_detail",
    "surface": "skill_detail",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "skill_id": "typescript-code-review",
    "skill_slug": "typescript-code-review",
    "skill_title": "TypeScript Code Review",
    "skill_category": "development",
    "skill_tags": ["typescript", "code-review", "security"]
  }
}
```

---

### 5. github_link_click

**Fires when:** User clicks a GitHub repository link

**Surfaces:** `catalog`, `skill_detail`

**Properties:**
```typescript
{
  page: PageType,
  surface: SurfaceType,
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  skill_id: string,
  skill_slug: string,
  skill_title: string,
  skill_category?: string,
  skill_tags?: string[],
  github_url: string,      // The GitHub URL (with UTM parameters)
  position?: number        // Position in list (if from a list)
}
```

**Example:**
```json
{
  "event": "github_link_click",
  "properties": {
    "page": "skill_detail",
    "surface": "skill_detail",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "skill_id": "typescript-code-review",
    "skill_slug": "typescript-code-review",
    "skill_title": "TypeScript Code Review",
    "skill_category": "development",
    "skill_tags": ["typescript", "code-review"],
    "github_url": "https://github.com/user/repo?utm_source=pawgrammer-skills&utm_medium=skill_detail&utm_campaign=github_traffic&utm_content=skill_detail"
  }
}
```

**Note:** GitHub URLs include UTM parameters for attribution:
- `utm_source=pawgrammer-skills`
- `utm_medium=skill_card` or `utm_medium=skill_detail`
- `utm_campaign=github_traffic`
- `utm_content={surface}` (e.g., `catalog`, `skill_detail`)

---

### 6. tag_click

**Fires when:** User clicks a tag to filter by it

**Surfaces:** `catalog`, `skill_detail`

**Properties:**
```typescript
{
  page: PageType,
  surface: SurfaceType,
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  tag: string             // The tag that was clicked
}
```

**Example:**
```json
{
  "event": "tag_click",
  "properties": {
    "page": "skill_detail",
    "surface": "skill_detail",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "tag": "typescript"
  }
}
```

---

### 7. home_section_impression

**Fires when:** A homepage section (Featured/Trending/Newest) becomes visible in viewport

**Surface:** `home`

**Properties:**
```typescript
{
  page: 'home',
  surface: 'home',
  session_id: string,
  schema_version: 1,
  consent_given: boolean,
  section: 'featured' | 'trending' | 'newest',
  skill_count: number     // Number of skills in the section
}
```

**Example:**
```json
{
  "event": "home_section_impression",
  "properties": {
    "page": "home",
    "surface": "home",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "schema_version": 1,
    "consent_given": true,
    "section": "trending",
    "skill_count": 5
  }
}
```

**Note:** Uses IntersectionObserver with 50% visibility threshold. Only fires once per section per page load.

---

## Server-Side Counter Events

These events are tracked server-side for computing trending scores:

### Vercel KV Counters

**24-hour view counter:**
- Key: `skill:{slug}:views:24h`
- TTL: 25 hours
- Incremented on: `skill_detail_view` events

**24-hour click counter:**
- Key: `skill:{slug}:clicks:24h`
- TTL: 25 hours
- Incremented on: `github_link_click` events

**7-day view counter:**
- Key: `skill:{slug}:views:7d`
- TTL: 8 days
- Incremented on: `skill_detail_view` events

### Trending Score Computation

Runs every 10 minutes via Vercel Cron (`/api/cron/compute-trending`):

```
trending_score = (clicks_24h × 3) + (views_24h × 0.2)
```

Requirements:
- Minimum 2 clicks OR 10 views in last 24 hours
- Top 5 skills by score are stored in `skills:trending:v1`

---

## Event Deduplication

To prevent double-firing from React Strict Mode:

- **Window:** 2 seconds
- **Storage:** sessionStorage
- **Key:** `analytics_last_{eventName}`
- **Logic:** Event is skipped if same event occurred within 2 seconds

---

## Privacy & Consent

### Consent Levels

1. **Essential (always active):**
   - Session management
   - Error logging
   - Core functionality

2. **Analytics (opt-in):**
   - PostHog product analytics
   - All events listed above

3. **Marketing (opt-in):**
   - Google Analytics 4
   - UTM parameter tracking

### Storage

- Consent state: `localStorage.getItem('analytics-consent')`
- Session ID: `sessionStorage` (ephemeral, resets on browser close)
- Last event times: `sessionStorage` (for deduplication)

---

## Type Definitions

```typescript
type PageType = 'home' | 'skill_detail';

type SurfaceType =
  | 'home'
  | 'catalog'
  | 'featured'
  | 'trending'
  | 'newest'
  | 'related_skills'
  | 'skill_detail';

type SortOption =
  | 'featured'
  | 'trending'
  | 'newest'
  | 'alphabetical'
  | 'relevance';

interface BaseEventProperties {
  page: PageType;
  surface: SurfaceType;
  session_id: string;
  schema_version: number;
  consent_given: boolean;
}
```

---

## Migration Notes

When updating event schemas:

1. Increment `SCHEMA_VERSION` constant in `lib/analytics/types.ts`
2. Document changes in this file under a new section
3. Maintain backward compatibility in PostHog queries by filtering on `schema_version`
4. Update TypeScript types in `lib/analytics/types.ts`

---

## Testing

To test analytics in development:

1. **Enable tracking:**
   ```typescript
   // In lib/analytics/posthog.ts, comment out the dev mode check
   // if (process.env.NODE_ENV === 'development') return;
   ```

2. **Check PostHog:**
   - Open PostHog Live Events view
   - Perform actions in your app
   - Verify events appear with correct properties

3. **Check browser console:**
   - All events are logged to console in development
   - Format: `[Analytics] Event: {eventName}`, properties

4. **Server-side counters:**
   - Check Vercel KV dashboard
   - Verify keys are created with correct TTLs
   - Run cron job manually: `curl -X POST https://your-domain/api/cron/compute-trending -H "Authorization: Bearer YOUR_CRON_SECRET"`

---

## Debugging

Common issues:

1. **Events not firing:**
   - Check cookie consent banner (must accept analytics)
   - Verify PostHog env vars are set
   - Check browser console for errors

2. **Duplicate events:**
   - React Strict Mode is active in dev (expected)
   - Check deduplication logic is working (2-second window)
   - Verify component is not re-mounting unnecessarily

3. **Server counters not incrementing:**
   - Check Vercel KV connection
   - Verify `CRON_SECRET` is correct
   - Check server-side logs for errors

---

Last updated: 2025-10-21
