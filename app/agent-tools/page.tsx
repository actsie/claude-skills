'use client';

import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AgentHeroCanvas = dynamic(() => import('@/components/AgentHeroCanvas'), { ssr: false });
const SubmitToolModal = dynamic(() => import('@/components/SubmitToolModal'), { ssr: false });


interface Tool {
  name: string;
  description: string;
  tags: string[];
  domain: string;
  href: string;
  highlight?: boolean;
  bento?: {
    colSpan?: number;
    rowSpan?: number;
    bg?: string;
    border?: string;
    textColor?: string;
    style?: 'solid' | 'border' | 'gradient';
  };
}

interface Section {
  title: string;
  tools: Tool[];
}

const sections: Section[] = [
  {
    title: 'Payments & Spending',
    tools: [
      {
        name: 'Mastercard Agent Pay',
        description: 'Network-level agentic payments with tokenized credentials and enterprise-grade security controls. Built for scale.',
        tags: ['enterprise', 'payments'],
        domain: 'mastercard.com',
        href: 'https://www.mastercard.com',
        bento: { colSpan: 2, rowSpan: 2, bg: '#1a1a2e', textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Ramp Agent Cards Beta',
        description: 'Built on Visa Intelligent Commerce — policy-driven virtual cards for autonomous agents with corporate expense integration.',
        tags: ['enterprise', 'payments', 'visa'],
        domain: 'ramp.com',
        href: 'https://ramp.com',
        bento: { colSpan: 2, rowSpan: 1, bg: '#1c1c1c', textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'AgentCard',
        description: 'Virtual cards + a dedicated @agentcard.email inbox for AI agents. The only card that handles payment and email verification without a human in the loop. Fund with USD or USDC on Base.',
        tags: ['developer', 'payments', 'crypto', 'mcp'],
        domain: 'agentcard.ai',
        href: 'https://agentcard.ai',
        highlight: true,
        bento: { colSpan: 2, rowSpan: 2, bg: '#0052ff', textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Slash',
        description: 'MCP-native agent cards with unlimited virtual cards, ACH payments, and stablecoin on/off ramps.',
        tags: ['developer', 'payments', 'crypto', 'mcp'],
        domain: 'slash.com',
        href: 'https://slash.com',
        bento: { colSpan: 1, rowSpan: 1, bg: '#0d2e2b', style: 'border', border: '#0d9488', textColor: '#0d9488' },
      },
      {
        name: 'Crossmint',
        description: 'Agent cards, wallets, and stablecoin onramps via a unified API. Built for platform developers.',
        tags: ['developer', 'payments', 'crypto'],
        domain: 'crossmint.com',
        href: 'https://crossmint.com',
        bento: { colSpan: 1, rowSpan: 1, bg: '#1e1030', style: 'border', border: '#7c3aed', textColor: '#a78bfa' },
      },
    ],
  },
  {
    title: 'Code & Dev Environments',
    tools: [
      {
        name: 'Cursor',
        description: 'AI code editor with native Claude support.',
        tags: ['editor', 'coding'],
        domain: 'cursor.com',
        href: 'https://cursor.com',
        bento: { colSpan: 2, rowSpan: 1, bg: '#0f172a', textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Cline',
        description: 'Open source Claude agent for VS Code.',
        tags: ['open source', 'coding', 'vscode'],
        domain: 'github.com/cline/cline',
        href: 'https://github.com/cline/cline',
        bento: { colSpan: 1, rowSpan: 1, style: 'border', border: '#22c55e', textColor: '#22c55e' },
      },
      {
        name: 'OpenClaw',
        description: 'Multi-step automation agent built on Claude, runs via Discord. Designed for long-running tasks with human-in-the-loop approval.',
        tags: ['automation', 'discord'],
        domain: 'openclaw.ai',
        href: 'https://openclaw.ai',
        bento: { colSpan: 1, rowSpan: 1, bg: '#ec4899', textColor: '#ffffff', style: 'solid' },
      },
    ],
  },
  {
    title: 'Monitoring & Observability',
    tools: [
      {
        name: 'Langfuse',
        description: 'Open source LLM tracing and cost tracking across Claude sessions.',
        tags: ['open source', 'observability', 'tracing'],
        domain: 'langfuse.com',
        href: 'https://langfuse.com',
        bento: { colSpan: 2, rowSpan: 1, bg: '#f59e0b', textColor: '#1f2937', style: 'solid' },
      },
      {
        name: 'Helicone',
        description: 'Proxy layer for the Claude API — logs every request, tracks spend, and rate-limits agents.',
        tags: ['proxy', 'observability', 'spend'],
        domain: 'helicone.ai',
        href: 'https://helicone.ai',
        bento: { colSpan: 2, rowSpan: 1, style: 'border', border: '#f59e0b', textColor: '#f59e0b' },
      },
    ],
  },
  {
    title: 'Agent Frameworks',
    tools: [
      {
        name: 'LangChain',
        description: 'Standard framework for chaining Claude calls, tools, and memory.',
        tags: ['framework', 'chaining', 'memory'],
        domain: 'langchain.com',
        href: 'https://langchain.com',
        bento: { colSpan: 1, rowSpan: 1, bg: '#1d4ed8', textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Hermes',
        description: 'Open-source autonomous agent by Nous Research. Persistent memory, multi-platform support (Telegram, Discord, Slack, WhatsApp, CLI), and works with 200+ models including Claude.',
        tags: ['open source', 'autonomous', 'multi-platform'],
        domain: 'github.com/NousResearch/Hermes',
        href: 'https://github.com/NousResearch/Hermes-Function-Calling',
        bento: { colSpan: 2, rowSpan: 1, style: 'border', border: '#a78bfa', textColor: '#a78bfa' },
      },
      {
        name: 'AutoGen',
        description: "Microsoft's collaborative multi-agent framework.",
        tags: ['framework', 'multi-agent', 'microsoft'],
        domain: 'microsoft.github.io/autogen',
        href: 'https://microsoft.github.io/autogen',
        bento: { colSpan: 1, rowSpan: 1, bg: '#0ea5e9', textColor: '#ffffff', style: 'solid' },
      },
    ],
  },
];

const tagColors: Record<string, string> = {
  enterprise: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  payments: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  visa: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  developer: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  crypto: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  mcp: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'open source': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  editor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  coding: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  vscode: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  automation: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  discord: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  observability: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  tracing: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  proxy: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  spend: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  framework: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  chaining: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  memory: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  autonomous: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'multi-platform': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'multi-agent': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  microsoft: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const defaultTagColor = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';

const coverColors: Record<string, string> = {
  'Mastercard Agent Pay': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'Ramp Agent Cards Beta': 'linear-gradient(135deg, #0f3460 0%, #1a4a7a 100%)',
  'AgentCard': 'linear-gradient(135deg, #2d1b69 0%, #4a2c9a 100%)',
  'Slash': 'linear-gradient(135deg, #0d4a3a 0%, #1a7a5a 100%)',
  'Crossmint': 'linear-gradient(135deg, #1a0a2e 0%, #3d1a6e 100%)',
  'Cursor': 'linear-gradient(135deg, #0a1628 0%, #162442 100%)',
  'Cline': 'linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)',
  'OpenClaw': 'linear-gradient(135deg, #2a0a1a 0%, #4a1a3a 100%)',
  'Langfuse': 'linear-gradient(135deg, #1a1400 0%, #3a2e00 100%)',
  'Helicone': 'linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 100%)',
  'LangChain': 'linear-gradient(135deg, #1a0a0a 0%, #3a1a1a 100%)',
  'Hermes': 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)',
  'AutoGen': 'linear-gradient(135deg, #001428 0%, #002a50 100%)',
};

function BentoCard({ tool }: { tool: Tool }) {
  const b = tool.bento ?? {};
  const isBorder = b.style === 'border';
  const isGradient = b.style === 'gradient';
  const textColor = b.textColor ?? '#ffffff';

  const bgStyle = isBorder
    ? { background: b.bg ?? 'transparent', border: `2px solid ${b.border ?? '#ffffff'}` }
    : isGradient
    ? { background: `linear-gradient(135deg, ${b.bg ?? '#6d28d9'} 0%, #4c1d95 100%)` }
    : { background: b.bg ?? '#1c1c1c' };

  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        ...bgStyle,
        color: textColor,
        gridColumn: `span ${b.colSpan ?? 1}`,
        gridRow: `span ${b.rowSpan ?? 1}`,
        minHeight: b.rowSpan === 2 ? '220px' : '110px',
        boxShadow: '0px 8px 40px rgba(0,0,0,0.25)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold leading-tight" style={{ color: textColor }}>
          {tool.name}
        </h3>
        <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: textColor }} />
      </div>
      <div>
        <p className="text-sm leading-relaxed opacity-70 mb-3" style={{ color: textColor }}>
          {tool.description}
        </p>
        <span className="text-[10px] opacity-40 font-mono truncate" style={{ color: textColor }}>{tool.domain}</span>
      </div>
    </a>
  );
}

export default function AgentToolsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#070d1a' }}>
      {/* Hero + Payments section — solid dark, no gradient */}
      <div className="relative overflow-hidden" style={{ background: '#070d1a' }}>
        {/* Canvas: mountain blobs + stars */}
        <AgentHeroCanvas />
        {/* Hero text */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Skills
          </Link>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Tools for Claude AI Agents
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Curated tools that extend what your agent can do — payments, coding, monitoring, and more.
            </p>
          </div>
        </div>

        {/* Payments & Spending section inside the same container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-2xl px-8 pt-8 pb-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 75%, #070d1a 100%)' }}>
            {/* Grainy top — fades from visible at top to nothing going down */}
            <div
              className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '80px 80px',
                opacity: 0.85,
                mixBlendMode: 'multiply' as const,
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              }}
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{sections[0].title}</h2>
            <div className="bento-grid grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(110px, auto)' }}>
              {sections[0].tools.map((tool) => (
                <BentoCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        {sections.slice(1).map((section) => (
          <div key={section.title} className="rounded-2xl px-8 pt-8 pb-8 border border-white/20 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-2xl font-bold mb-6 text-white">
              {section.title}
            </h2>
            <div className="bento-grid grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(110px, auto)' }}>
              {section.tools.map((tool) => (
                <BentoCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer nudge */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Sparse twinkling stars */}
        {[
          { top: '20%', left: '8%', size: 2, delay: 0 },
          { top: '60%', left: '18%', size: 1.5, delay: 0.8 },
          { top: '35%', left: '35%', size: 1, delay: 1.6 },
          { top: '75%', left: '55%', size: 2, delay: 0.4 },
          { top: '15%', left: '72%', size: 1.5, delay: 1.2 },
          { top: '50%', left: '88%', size: 1, delay: 2.0 },
          { top: '80%', left: '95%', size: 1.5, delay: 0.6 },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `pulse ${2 + s.delay}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              opacity: 0.5,
            }}
          />
        ))}
        <p className="text-sm text-gray-500 relative z-10">
          Know a tool that belongs here?{' '}
          <button onClick={() => setModalOpen(true)} className="text-teal-400 hover:underline">
            Submit it
          </button>
        </p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:underline relative z-10">
          <ArrowLeft className="w-4 h-4" /> Browse Claude Skills
        </Link>
      </div>
      <SubmitToolModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
