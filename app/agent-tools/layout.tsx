import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools for Claude AI Agents',
  description:
    'Curated tools that extend what your AI agent can do — payments, monitoring, coding frameworks, and more.',
  alternates: {
    canonical: '/agent-tools',
  },
};

export default function AgentToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
