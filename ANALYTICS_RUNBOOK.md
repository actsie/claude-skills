# Analytics Runbook

Operational procedures for managing the Claude Skills Market analytics system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Environment Variables](#environment-variables)
3. [Key Rotation](#key-rotation)
4. [Emergency Procedures](#emergency-procedures)
5. [Data Management](#data-management)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Troubleshooting](#troubleshooting)
8. [Scheduled Jobs](#scheduled-jobs)

---

## System Overview

### Architecture

```
┌─────────────────┐
│   Client App    │
│  (Browser)      │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────┐
│PostHog │  │ GA4      │
│        │  │ (gtag)   │
└────────┘  └──────────┘
         │
         ▼
┌─────────────────┐
│ Server Fallback │
│ /api/analytics  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upstash Redis      │
│  (Redis)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cron Job       │
│  (Trending)     │
└─────────────────┘
```

### Components

- **PostHog:** Product analytics (user behavior, events)
- **GA4:** Marketing analytics (traffic sources, campaigns)
- **Upstash Redis:** Redis-compatible storage for counters and caching
- **Vercel Cron:** Scheduled trending computation (once daily at midnight UTC)

---

## Environment Variables

### Required Variables

#### Production (`.env.production`)

```bash
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cron Security
CRON_SECRET=your-secure-random-string-here
```

#### Development (`.env.local`)

```bash
# PostHog (use separate project for dev)
NEXT_PUBLIC_POSTHOG_KEY=phc_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# GA4 (optional in dev)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Upstash Redis (use dev database)
UPSTASH_REDIS_REST_URL=https://dev-xxxxx.kv.vercel-storage.com
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cron Security
CRON_SECRET=dev-cron-secret
```

### Setting Environment Variables

**Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope (Production/Preview/Development)
3. Redeploy after adding variables

**Local Development:**
1. Copy `.env.example` to `.env.local`
2. Fill in your development credentials
3. Never commit `.env.local` to git

---

## Key Rotation

### PostHog Key Rotation

**When to rotate:**
- Key compromised or exposed
- Regular security audit (recommended: annually)
- Changing PostHog projects

**Steps:**

1. **Generate new key in PostHog:**
   - Log in to PostHog
   - Go to Project Settings → API Keys
   - Create new project API key
   - Copy the key (starts with `phc_`)

2. **Update environment variables:**
   ```bash
   # Vercel Dashboard
   vercel env add NEXT_PUBLIC_POSTHOG_KEY production
   # Paste new key when prompted
   ```

3. **Redeploy:**
   ```bash
   vercel deploy --prod
   ```

4. **Verify:**
   - Check PostHog Live Events
   - Confirm new events are appearing

5. **Revoke old key:**
   - In PostHog, delete the old API key
   - Monitor for errors (should be none after deploy)

### GA4 Measurement ID Rotation

**Steps:**

1. **Create new GA4 property:**
   - Google Analytics → Admin → Create Property
   - Copy new Measurement ID (starts with `G-`)

2. **Update environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
   ```

3. **Redeploy:**
   ```bash
   vercel deploy --prod
   ```

4. **Verify in GA4:**
   - Check Realtime view
   - Confirm events are flowing to new property

### Upstash Redis Token Rotation

**Steps:**

1. **Create new Redis database (recommended) or rotate credentials:**
   - Go to https://console.upstash.com
   - Create new database or rotate credentials for existing database
   - Copy new REST URL and REST token

2. **Update environment variables:**
   ```bash
   vercel env add UPSTASH_REDIS_REST_URL production
   vercel env add UPSTASH_REDIS_REST_TOKEN production
   ```

3. **Redeploy:**
   ```bash
   vercel deploy --prod
   ```

4. **Verify:**
   ```bash
   # Check Redis connection
   curl https://your-domain.com/api/trending
   ```

5. **Migrate data (if using new database):**
   - Use Upstash console's Data Browser to export/import
   - Or use the Upstash Redis CLI tool

### Cron Secret Rotation

**Steps:**

1. **Generate new secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update environment variable:**
   ```bash
   vercel env add CRON_SECRET production
   ```

3. **Redeploy:**
   ```bash
   vercel deploy --prod
   ```

4. **Verify cron works:**
   ```bash
   curl -X POST https://your-domain.com/api/cron/compute-trending \
     -H "Authorization: Bearer YOUR_NEW_SECRET"
   ```

---

## Emergency Procedures

### 1. Disable All Analytics Immediately

**Scenario:** Data breach, GDPR violation, or critical bug

**Steps:**

1. **Remove PostHog key:**
   ```bash
   vercel env rm NEXT_PUBLIC_POSTHOG_KEY production
   vercel deploy --prod
   ```

2. **Remove GA4 ID:**
   ```bash
   vercel env rm NEXT_PUBLIC_GA_MEASUREMENT_ID production
   vercel deploy --prod
   ```

**Effect:** All client-side tracking stops immediately upon deployment (< 1 minute)

**Rollback:**
```bash
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
vercel deploy --prod
```

### 2. Disable Trending Computation

**Scenario:** Trending algorithm causing issues, high Redis usage

**Steps:**

1. **Remove cron job from `vercel.json`:**
   ```json
   {
     "crons": []
   }
   ```

2. **Deploy:**
   ```bash
   git add vercel.json
   git commit -m "Emergency: Disable trending cron"
   git push
   vercel deploy --prod
   ```

**Effect:** Trending scores stop updating; trending section uses cached/stale data (updates daily)

**Rollback:**
Restore cron configuration and deploy

### 3. Purge Sensitive Data from Redis

**Scenario:** Accidentally stored PII in Redis

**Steps:**

1. **Use Upstash Console:**
   - Go to https://console.upstash.com
   - Select your database
   - Use Data Browser to view and delete keys
   - Search for keys using patterns like `skill:*:views:*`

2. **Or use Redis CLI (if needed):**
   - Install redis-cli or use Upstash CLI
   - Connect to your database
   - Delete specific keys: `DEL skill:example-slug:views:24h`

3. **Verify deletion:**
   - Check Data Browser or use `GET skill:example-slug:views:24h`
   - Should return null

### 4. Emergency Cache Clear

**Scenario:** Corrupt trending data, stale cache

**Steps:**

1. **Clear trending cache (using Upstash Console or API):**
   - Option A: Use Upstash console Data Browser to delete keys:
     - `skills:trending:v1`
     - `skills:trending:last_good`
   - Option B: Use Redis DEL command via API or CLI

2. **Trigger recomputation:**
   ```bash
   curl -X POST https://your-domain.com/api/cron/compute-trending \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

3. **Verify:**
   ```bash
   curl https://your-domain.com/api/trending | jq
   ```

---

## Data Management

### Backup Upstash Redis Data

**Frequency:** Weekly (recommended)

**Steps:**

1. **Use Upstash Console Backup:**
   - Go to https://console.upstash.com
   - Select your database
   - Use the built-in backup feature (if available on your plan)

2. **Or manual export:**
   - Use Upstash Data Browser to export keys
   - Use Redis DUMP commands for specific keys
   - Store backups in S3 or similar

**Note:** Upstash Redis has built-in persistence and replication. For trending data, it's safe to rely on recomputation from the cron job.

### Restore from Backup

- Use Upstash console restore feature
- Or manually import keys using Redis CLI or API

### Clear Old Event Data

Redis keys have automatic TTLs:
- `skill:*:views:24h` → 25 hours
- `skill:*:clicks:24h` → 25 hours
- `skill:*:views:7d` → 8 days

**Manual cleanup (if needed):**
- Use Upstash console Data Browser to search and delete expired keys
- Or use Redis DEL commands
- TTL cleanup should happen automatically - manual intervention rarely needed

### Data Retention Policy

| Data Type | Retention | Location | Notes |
|-----------|-----------|----------|-------|
| Event data | 90 days | PostHog | Configurable in PostHog settings |
| GA4 data | 14 months | Google Analytics | Standard retention |
| Redis counters | 24h-8d | Upstash Redis | Automatic TTL |
| Trending cache | 24 hours | Upstash Redis | Recomputed daily at midnight UTC |

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Event Volume:**
   - PostHog: Events per hour
   - Alert if < 10 events/hour (may indicate tracking broken)

2. **Cron Job Success Rate:**
   - Vercel logs: Check `/api/cron/compute-trending`
   - Alert if failures > 2 consecutive runs

3. **Redis Storage Usage:**
   - Upstash console: Database metrics
   - Alert if > 80% of plan limit

4. **Page Load Time:**
   - Analytics script load time
   - Alert if > 500ms (may indicate PostHog/GA4 issues)

### Setting Up Alerts

**Vercel Monitoring:**
```bash
# Install Vercel CLI
npm i -g vercel

# Enable log drains (to external service)
vercel log-drain add https://your-logging-service.com/endpoint
```

**PostHog Monitoring:**
1. Go to PostHog → Insights
2. Create insight: "Events per hour"
3. Set alert threshold: < 10 events/hour
4. Configure notification (Slack, email, etc.)

**Recommended Slack Alerts:**
- Cron job failures
- PostHog event volume drop
- Redis quota exceeded

---

## Troubleshooting

### Issue: Events not appearing in PostHog

**Diagnosis:**
1. Check browser console for errors
2. Verify PostHog key in env vars
3. Check user has accepted analytics consent
4. Verify network requests to PostHog

**Solutions:**
```javascript
// Test PostHog connection directly
import posthog from 'posthog-js';
posthog.capture('test_event', { test: true });

// Check if PostHog is loaded
console.log('PostHog loaded:', !!window.posthog);

// Verify key
console.log('PostHog key:', process.env.NEXT_PUBLIC_POSTHOG_KEY?.slice(0, 8));
```

### Issue: Trending section showing wrong skills

**Diagnosis:**
```bash
# Check KV data
vercel kv get skills:trending:v1

# Check individual counters
vercel kv get skill:example-slug:clicks:24h
vercel kv get skill:example-slug:views:24h
```

**Solutions:**
1. Clear cache and recompute:
   ```bash
   vercel kv del skills:trending:v1
   curl -X POST https://your-domain.com/api/cron/compute-trending \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

2. Check cron job logs:
   ```bash
   vercel logs --since 1h
   ```

### Issue: Cron job not running

**Diagnosis:**
```bash
# Check vercel.json
cat vercel.json

# Verify CRON_SECRET exists
vercel env ls | grep CRON_SECRET

# Check logs
vercel logs --filter=/api/cron --since 1h
```

**Solutions:**
1. Verify `vercel.json` is deployed
2. Check cron is enabled for your plan
3. Manually trigger to test:
   ```bash
   curl -X POST https://your-domain.com/api/cron/compute-trending \
     -H "Authorization: Bearer YOUR_CRON_SECRET" -v
   ```

### Issue: High Redis usage / quota exceeded

**Diagnosis:**
- Check Upstash console for key count and memory usage
- Use Data Browser to inspect keys

**Solutions:**
1. Clear expired keys manually (TTL should handle this automatically):
   - Use Upstash console Data Browser
   - Filter by pattern `skill:*:*:24h` and delete

2. Reduce counter TTLs:
   ```typescript
   // In /app/api/analytics/track/route.ts
   await redis.expire(`skill:${skillId}:views:24h`, 24 * 60 * 60); // 24h instead of 25h
   ```

3. Upgrade Upstash Redis plan (check pricing at https://upstash.com/pricing)

### Issue: UTM parameters not appearing in GA4

**Diagnosis:**
1. Check link has UTM params in browser DevTools
2. Verify GA4 is loading
3. Check GA4 Realtime → Event parameters

**Solutions:**
```typescript
// Verify UTM params are added
const url = new URL('https://github.com/user/repo');
url.searchParams.set('utm_source', 'pawgrammer-skills');
console.log(url.toString());
// Should output: https://github.com/user/repo?utm_source=pawgrammer-skills...
```

---

## Scheduled Jobs

### Trending Computation Cron

**Schedule:** Once daily at midnight UTC (`0 0 * * *`)

**Endpoint:** `/api/cron/compute-trending`

**Authentication:** `Authorization: Bearer {CRON_SECRET}`

**What it does:**
1. Fetches all skills from search index
2. Gets view/click counters from Redis
3. Computes trending scores: `(clicks_24h × 3) + (views_24h × 0.2)`
4. Filters skills with minimum signal (1 click in 24h)
5. Stores top 5 in `skills:trending:v1` (24 hour TTL)
6. Stores backup in `skills:trending:last_good` (no TTL)

**Manual trigger:**
```bash
curl -X POST https://your-domain.com/api/cron/compute-trending \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Monitoring:**
```bash
# Check last run
vercel logs --filter=/api/cron --since 24h

# Check output
curl https://your-domain.com/api/trending | jq '.trending[] | {title, score}'
```

**Troubleshooting:**
- If cron fails, trending section falls back to `skills:trending:last_good`
- If both missing, trending section returns empty array (hidden on frontend)
- Check logs for errors: `vercel logs --filter=compute-trending`
- Note: Trending data updates once daily, so expect 24-hour staleness between updates

---

## Best Practices

### Security

1. **Never log PII:** Session IDs are ephemeral UUIDs, not user emails
2. **Rotate secrets annually:** PostHog keys, GA4 IDs, cron secrets
3. **Use separate environments:** Dev PostHog project, dev KV database
4. **Monitor access logs:** Check for unauthorized API calls

### Performance

1. **Use server fallback sparingly:** Only when PostHog blocked by ad-blockers
2. **Batch Redis operations:** Use `Promise.all()` for parallel increments
3. **Set appropriate TTLs:** Don't store data longer than needed
4. **Cache trending data:** 24-hour cache aligns with daily cron schedule

### Privacy

1. **Respect consent:** Check `consent_given` before tracking
2. **Clear docs:** Keep EVENT_DICTIONARY.md updated
3. **Data minimization:** Only track what's needed for analytics
4. **User control:** Cookie banner allows granular control

---

## Support Contacts

- **PostHog Support:** support@posthog.com
- **Vercel Support:** https://vercel.com/support
- **Google Analytics:** https://support.google.com/analytics

---

Last updated: 2025-10-21
