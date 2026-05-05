'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function KnowledgeSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    const accent = '#F97316';
    const isLight = theme === 'light';

    const particles = Array.from({ length: 180 }, () => ({
      x: (Math.random() - 0.5) * 560,
      y: (Math.random() - 0.5) * 560,
      z: (Math.random() - 0.5) * 560,
      size: Math.random() * 2.2 + 0.5,
      color: Math.random() > 0.93 ? accent : (Math.random() > 0.55 ? '#60A5FA' : '#93c5fd'),
      vy: 0.04 + Math.random() * 0.06,
      vx: (Math.random() - 0.5) * 0.012,
      vz: (Math.random() - 0.5) * 0.012,
      phase: Math.random() * Math.PI * 2,
    }));

    const floatObjs = [
      { angle: 0, radius: 160, tilt: 0.14, period: 14, phase: 0, label: 'book' },
      { angle: 2.09, radius: 185, tilt: -0.21, period: 18, phase: 2.09, label: 'cap' },
      { angle: 4.19, radius: 210, tilt: 0.38, period: 22, phase: 4.19, label: 'globe' },
    ];

    function drawSphere(cx: number, cy: number, t: number) {
      if (!ctx) return;
      const r = 100;
      const pulse = 1.0 + Math.sin(t * 0.6) * 0.025;
      const pr = r * pulse;

      const glows = [
        { r: pr * 3.2, a: 0.06 },
        { r: pr * 2.4, a: 0.1 },
        { r: pr * 1.7, a: 0.18 },
      ];
      glows.forEach(g => {
        const grd = ctx.createRadialGradient(cx, cy, pr * 0.3, cx, cy, g.r);
        grd.addColorStop(0, `rgba(59,130,246,${g.a})`);
        grd.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, g.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      const grad = ctx.createRadialGradient(cx - pr * 0.3, cy - pr * 0.3, pr * 0.05, cx, cy, pr);
      const t2 = (Math.sin(t * 0.6) * 0.5 + 0.5);
      const emR = Math.round(30 + t2 * 29);
      const emG = Math.round(64 + t2 * 101);
      const emB = Math.round(175 + t2 * 75);
      grad.addColorStop(0, `rgb(147,197,253)`);
      grad.addColorStop(0.3, `rgb(96,165,250)`);
      grad.addColorStop(0.7, `rgb(${emR},${emG},${emB})`);
      grad.addColorStop(1, `rgb(12,27,74)`);
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const rim = ctx.createRadialGradient(cx, cy, pr * 0.65, cx, cy, pr);
      rim.addColorStop(0, 'rgba(96,165,250,0)');
      rim.addColorStop(0.75, 'rgba(96,165,250,0.08)');
      rim.addColorStop(1, 'rgba(147,197,253,0.5)');
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 0.7;
      const wR = pr * 1.18;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI;
        const ry = Math.cos(a) * wR;
        const rx = Math.sin(a) * wR;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), wR, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const lat = -Math.PI / 2 + (i + 1) * Math.PI / 7;
        const ry = Math.cos(lat) * wR;
        const rx = Math.sin(lat) * wR;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(rx) * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawFloatObj(cx: number, cy: number, obj: any, t: number) {
      if (!ctx) return;
      const speed = (2 * Math.PI) / obj.period;
      const angle = obj.angle + t * speed + obj.phase * 0.1;
      const bob = Math.sin(t * 0.6 + obj.phase) * 14;
      const x = cx + Math.cos(angle) * obj.radius;
      const y = cy + Math.sin(angle) * obj.radius * Math.abs(Math.cos(obj.tilt)) + bob;

      const sz = 32;
      ctx.save();
      ctx.translate(x, y);

      const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, sz * 1.6);
      grd.addColorStop(0, 'rgba(59,130,246,0.35)');
      grd.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.beginPath();
      ctx.arc(0, 0, sz * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(-sz / 2, -sz / 2, sz, sz, 8);
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.85)' : 'rgba(11,16,36,0.8)';
      ctx.strokeStyle = 'rgba(96,165,250,0.4)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (obj.label === 'book') {
        ctx.beginPath();
        ctx.moveTo(-9, -10); ctx.lineTo(-9, 10); ctx.lineTo(9, 10); ctx.lineTo(9, -10);
        ctx.moveTo(-9, -10); ctx.bezierCurveTo(-6, -12, 6, -12, 9, -10);
        ctx.moveTo(0, -10); ctx.lineTo(0, 10);
        ctx.stroke();
      } else if (obj.label === 'cap') {
        ctx.beginPath();
        ctx.moveTo(-11, 1); ctx.lineTo(0, -7); ctx.lineTo(11, 1); ctx.lineTo(-11, 1);
        ctx.moveTo(-7, 1); ctx.lineTo(-7, 8); ctx.lineTo(7, 8); ctx.lineTo(7, 1);
        ctx.moveTo(11, 1); ctx.lineTo(11, 6);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
        ctx.moveTo(0, -10); ctx.bezierCurveTo(5, -5, 5, 5, 0, 10);
        ctx.moveTo(0, -10); ctx.bezierCurveTo(-5, -5, -5, 5, 0, 10);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawParticles(cx: number, cy: number, t: number) {
      if (!ctx) return;
      particles.forEach(p => {
        p.y -= p.vy;
        p.x += p.vx;
        p.z += p.vz;
        if (p.y > 280) p.y = -280;

        const screenX = cx + p.x + Math.sin(t * 0.3 + p.phase) * 2;
        const screenY = cy + p.y;
        const alpha = Math.max(0, Math.min(1, (280 - Math.abs(p.y)) / 60));

        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    function frame(ts: number) {
      if (!running || !canvas || !ctx) return;
      timeRef.current = ts * 0.001;
      const t = timeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.52;
      const cy = h * 0.48;

      drawParticles(cx, cy, t);
      drawSphere(cx, cy, t);
      floatObjs.forEach(obj => drawFloatObj(cx, cy, obj, t));

      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="h-full w-full block min-h-[420px]" />;
}
