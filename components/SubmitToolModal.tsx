'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Payments & Spending',
  'Code & Dev Environments',
  'Monitoring & Observability',
  'Agent Frameworks',
  'Other',
];

export default function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [form, setForm] = useState({ name: '', url: '', category: '', description: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Mini star canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const stars = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.003,
    }));

    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      t += 0.016;
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/discord/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', url: '', category: '', description: '', email: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#070d1a' }}>
        {/* Star canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-60px] left-[-40px] w-64 h-64 rounded-full opacity-30 blur-[70px]"
            style={{ background: 'radial-gradient(ellipse, #0d7a5f 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-40px] right-[-30px] w-56 h-56 rounded-full opacity-20 blur-[60px]"
            style={{ background: 'radial-gradient(ellipse, #0a4f7a 0%, transparent 70%)' }} />
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-xs text-teal-400 font-medium uppercase tracking-wider">Submit a Tool</span>
              </div>
              <h2 className="text-xl font-bold text-white">Know a great agent tool?</h2>
              <p className="text-sm text-gray-400 mt-1">Tell us about it and we&apos;ll review it for the list.</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-white font-semibold mb-1">Got it, thanks!</p>
              <p className="text-gray-400 text-sm">We&apos;ll review it and add it if it&apos;s a good fit.</p>
              <button onClick={onClose} className="mt-6 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tool name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Langfuse"
                    className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">URL *</label>
                  <input
                    required
                    type="url"
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    placeholder="https://"
                    className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 bg-white/5 focus:outline-none focus:border-teal-500 transition-colors appearance-none"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <option value="" disabled className="bg-gray-900">Select a category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-gray-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Short description *</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What does it do for AI agents?"
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Your email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-400">Something went wrong — try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-medium transition-colors mt-1"
              >
                <Send className="w-4 h-4" />
                {status === 'loading' ? 'Submitting…' : 'Submit tool'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
