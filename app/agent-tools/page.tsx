'use client';

import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AgentHeroCanvas = dynamic(() => import('@/components/AgentHeroCanvas'), { ssr: false });
const SubmitToolModal = dynamic(() => import('@/components/SubmitToolModal'), { ssr: false });

const agentToolsPalette = {
  page: '#070d1a',
  agentcard: '#0052ff',
  ink: '#050914',
  navy: '#0b1220',
  navy2: '#111827',
  navy3: '#172033',
  teal: '#0d7a5f',
  green: '#16a36d',
  mint: '#7dffd2',
  warm: '#d6b46a',
  glass: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(125,255,210,0.22)',
};


interface Tool {
  name: string;
  description: string;
  tags: string[];
  domain: string;
  href: string;
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
        bento: { colSpan: 2, rowSpan: 2, bg: agentToolsPalette.navy2, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Ramp Agent Cards Beta',
        description: 'Policy-driven virtual cards for autonomous agents, using tokenized credentials through Visa Intelligent Commerce and Ramp expense controls.',
        tags: ['enterprise', 'payments', 'visa'],
        domain: 'ramp.com',
        href: 'https://ramp.com',
        bento: { colSpan: 2, rowSpan: 1, bg: agentToolsPalette.navy, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'AgentCard',
        description: 'Virtual cards + a dedicated @agentcard.email inbox for AI agents. The only card that handles payment and email verification without a human in the loop. Fund with USD or USDC on Base.',
        tags: ['developer', 'payments', 'crypto', 'email', 'x402'],
        domain: 'agentcard.ai',
        href: 'https://agentcard.ai',
        bento: { colSpan: 2, rowSpan: 2, bg: agentToolsPalette.agentcard, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Slash',
        description: 'MCP-native agent cards with unlimited virtual cards, ACH payments, and stablecoin on/off ramps.',
        tags: ['developer', 'payments', 'crypto', 'mcp'],
        domain: 'slash.com',
        href: 'https://slash.com',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.ink, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Crossmint',
        description: 'Agent cards, wallets, and stablecoin onramps via a unified API. Built for platform developers.',
        tags: ['developer', 'payments', 'crypto'],
        domain: 'crossmint.com',
        href: 'https://crossmint.com',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.navy3, style: 'border', border: agentToolsPalette.glassBorder, textColor: agentToolsPalette.mint },
      },
    ],
  },
  {
    title: 'Coding & Agent Runtimes',
    tools: [
      {
        name: 'Cursor',
        description: 'AI code editor with Claude models available in its model picker.',
        tags: ['editor', 'coding'],
        domain: 'cursor.com',
        href: 'https://cursor.com',
        bento: { colSpan: 2, rowSpan: 1, bg: agentToolsPalette.navy2, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Cline',
        description: 'Open-source coding agent for VS Code with Claude support.',
        tags: ['open source', 'coding', 'vscode'],
        domain: 'github.com/cline/cline',
        href: 'https://github.com/cline/cline',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.glass, style: 'border', border: agentToolsPalette.glassBorder, textColor: agentToolsPalette.mint },
      },
      {
        name: 'OpenClaw',
        description: 'Multi-step automation agent built on Claude, runs via Discord. Designed for long-running tasks with human-in-the-loop approval.',
        tags: ['automation', 'discord'],
        domain: 'openclaw.ai',
        href: 'https://openclaw.ai',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.teal, textColor: '#ffffff', style: 'solid' },
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
        bento: { colSpan: 2, rowSpan: 1, bg: agentToolsPalette.warm, textColor: '#111827', style: 'solid' },
      },
      {
        name: 'Helicone',
        description: 'Proxy layer for the Claude API — logs every request, tracks spend, and rate-limits agents.',
        tags: ['proxy', 'observability', 'spend'],
        domain: 'helicone.ai',
        href: 'https://helicone.ai',
        bento: { colSpan: 2, rowSpan: 1, bg: agentToolsPalette.glass, style: 'border', border: agentToolsPalette.warm, textColor: agentToolsPalette.warm },
      },
    ],
  },
  {
    title: 'Agent Frameworks',
    tools: [
      {
        name: 'LangChain',
        description: 'Open-source framework for building agents with model, tool, and database integrations.',
        tags: ['framework', 'chaining', 'memory'],
        domain: 'langchain.com',
        href: 'https://langchain.com',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.navy3, textColor: '#ffffff', style: 'solid' },
      },
      {
        name: 'Hermes',
        description: 'Open-source autonomous agent by Nous Research. Persistent memory, multi-platform support (Telegram, Discord, Slack, WhatsApp, CLI), and works with 200+ models including Claude.',
        tags: ['open source', 'autonomous', 'multi-platform'],
        domain: 'github.com/NousResearch/Hermes',
        href: 'https://github.com/NousResearch/Hermes-Function-Calling',
        bento: { colSpan: 2, rowSpan: 1, bg: agentToolsPalette.glass, style: 'border', border: agentToolsPalette.glassBorder, textColor: agentToolsPalette.mint },
      },
      {
        name: 'AutoGen',
        description: "Microsoft's open-source framework for multi-agent AI applications; existing users are encouraged toward Microsoft Agent Framework.",
        tags: ['framework', 'multi-agent', 'microsoft'],
        domain: 'microsoft.github.io/autogen',
        href: 'https://microsoft.github.io/autogen',
        bento: { colSpan: 1, rowSpan: 1, bg: agentToolsPalette.navy2, textColor: '#ffffff', style: 'solid' },
      },
    ],
  },
];

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
          <div className="rounded-2xl px-8 pt-8 pb-20 relative overflow-hidden bg-white">
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
