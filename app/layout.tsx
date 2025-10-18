import type { Metadata } from 'next';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import PawgrammerBanner from '@/components/PawgrammerBanner';

export const metadata: Metadata = {
  title: 'Claude Skills Market',
  description: 'Make Claude your specialist. Discover and share modular Skills that extend Claude with real-world expertise.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PawgrammerBanner />
        {children}
      </body>
    </html>
  );
}
