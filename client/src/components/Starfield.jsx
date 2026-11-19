// Animated star background drawn on a <canvas> behind the whole site.
import { useEffect, useRef } from 'react';

export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars = [];
    let shooting = null;
    let frame;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((window.innerWidth * window.innerHeight) / 4500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        drift: Math.random() * 0.06 + 0.01,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        s.phase += s.speed;
        if (!reduceMotion) {
          s.y -= s.drift;
          if (s.y < 0) s.y = window.innerHeight;
        }
        ctx.globalAlpha = 0.35 + Math.sin(s.phase) * 0.35 + 0.3;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // occasional shooting star
      if (!reduceMotion && !shooting && Math.random() < 0.004) {
        shooting = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight * 0.4, life: 1 };
      }
      if (shooting) {
        ctx.globalAlpha = shooting.life;
        const grad = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - 90, shooting.y - 40);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(shooting.x - 90, shooting.y - 40);
        ctx.stroke();
        shooting.x += 9;
        shooting.y += 4;
        shooting.life -= 0.02;
        if (shooting.life <= 0) shooting = null;
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="space-bg" aria-hidden="true">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <canvas ref={ref} />
    </div>
  );
}
