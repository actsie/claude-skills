'use client';

import { useEffect } from 'react';
import { initPostHog, enablePostHogTracking, disablePostHogTracking } from '@/lib/analytics/posthog';
import { hasAnalyticsConsent, hasMarketingConsent } from '@/lib/analytics/consent';
import Script from 'next/script';

export default function Analytics() {
  useEffect(() => {
    // Initialize PostHog if consent is given
    if (hasAnalyticsConsent()) {
      initPostHog();
    }

    // Listen for consent changes
    const handleConsentUpdate = (event: any) => {
      const consent = event.detail;

      if (consent?.analytics) {
        initPostHog();
        enablePostHogTracking();
      } else {
        disablePostHogTracking();
      }
    };

    window.addEventListener('consent-updated', handleConsentUpdate);

    return () => {
      window.removeEventListener('consent-updated', handleConsentUpdate);
    };
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const hasMarketing = hasMarketingConsent();

  return (
    <>
      {/* Google Analytics 4 - Only load if marketing consent given */}
      {gaId && hasMarketing && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
