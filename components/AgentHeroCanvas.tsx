'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

export default function AgentHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    function initStars() {
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height * 0.65,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    // Generate control points for organic mountain blobs
    function blobPath(
      points: [number, number][],
      tension = 0.35
    ): void {
      if (!ctx || points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
        const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
        const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
        const cp2y = p2[1] - (p3[1] - p1[1]) * tension;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
      }
    }

    function drawFrame() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Mountain blob 1 — deep back, teal
      const m1y = h * 0.55 + Math.sin(t * 0.3) * 6;
      blobPath([
        [0, h],
        [0, m1y + 40],
        [w * 0.08, m1y + 10],
        [w * 0.18, m1y - 60],
        [w * 0.28, m1y - 20],
        [w * 0.38, m1y - 80],
        [w * 0.5, m1y + 5],
        [w * 0.62, m1y - 50],
        [w * 0.74, m1y + 20],
        [w * 0.85, m1y - 30],
        [w, m1y + 30],
        [w, h],
      ]);
      const g1 = ctx.createLinearGradient(0, m1y - 80, 0, h);
      g1.addColorStop(0, 'rgba(13,80,60,0.55)');
      g1.addColorStop(1, 'rgba(7,13,26,0.0)');
      ctx.fillStyle = g1;
      ctx.fill();

      // Mountain blob 2 — mid, blue-green
      const m2y = h * 0.65 + Math.sin(t * 0.2 + 1) * 8;
      blobPath([
        [0, h],
        [0, m2y + 20],
        [w * 0.1, m2y - 30],
        [w * 0.22, m2y + 10],
        [w * 0.34, m2y - 70],
        [w * 0.44, m2y - 10],
        [w * 0.55, m2y - 90],
        [w * 0.67, m2y + 20],
        [w * 0.78, m2y - 40],
        [w * 0.88, m2y + 10],
        [w, m2y - 20],
        [w, h],
      ]);
      const g2 = ctx.createLinearGradient(0, m2y - 90, 0, h);
      g2.addColorStop(0, 'rgba(10,60,80,0.5)');
      g2.addColorStop(1, 'rgba(7,13,26,0.0)');
      ctx.fillStyle = g2;
      ctx.fill();

      // Mountain blob 3 — front, darkest
      const m3y = h * 0.72 + Math.sin(t * 0.15 + 2) * 5;
      blobPath([
        [0, h],
        [0, m3y + 10],
        [w * 0.12, m3y - 20],
        [w * 0.25, m3y + 15],
        [w * 0.4, m3y - 55],
        [w * 0.52, m3y + 5],
        [w * 0.65, m3y - 35],
        [w * 0.78, m3y + 25],
        [w * 0.9, m3y - 15],
        [w, m3y + 20],
        [w, h],
      ]);
      const g3 = ctx.createLinearGradient(0, m3y - 55, 0, h);
      g3.addColorStop(0, 'rgba(5,40,55,0.65)');
      g3.addColorStop(1, 'rgba(7,13,26,0.0)');
      ctx.fillStyle = g3;
      ctx.fill();

      // Stars
      for (const star of stars) {
        star.alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * star.speed * 60 + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      }

      t += 0.016;
      animationId = requestAnimationFrame(drawFrame);
    }

    resize();
    window.addEventListener('resize', resize);
    drawFrame();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
