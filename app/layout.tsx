import type { Metadata } from 'next';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import PawgrammerBanner from '@/components/PawgrammerBanner';
import Analytics from '@/components/Analytics';
import { generateWebsiteSchema, generateOrganizationSchema, generateJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: 'Claude Skills Market',
    template: '%s | Claude Skills Market',
  },
  description: 'Make Claude your specialist. Discover and share modular Skills that extend Claude with real-world expertise.',
  keywords: ['Claude AI', 'AI Skills', 'Claude Skills', 'AI Marketplace', 'Claude Code', 'AI Automation', 'Productivity Tools'],
  authors: [{ name: 'Claude Skills Market' }],
  creator: 'Claude Skills Market',
  publisher: 'Claude Skills Market',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Claude Skills Market',
    description: 'Make Claude your specialist. Discover and share modular Skills that extend Claude with real-world expertise.',
    siteName: 'Claude Skills Market',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Claude Skills Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Skills Market',
    description: 'Make Claude your specialist. Discover and share modular Skills that extend Claude with real-world expertise.',
    images: ['/og-image.png'],
    creator: '@claudeai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YEn12j7oNIds3nwCEgi1w7m3gIpAGwEIP1OL_CELhfA',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  icons: {
    icon: '/pawgrammericonnew.png',
    apple: '/pawgrammericonnew.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonLd([websiteSchema, organizationSchema])}
        />
      </head>
      <body className="antialiased">
        <PawgrammerBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
