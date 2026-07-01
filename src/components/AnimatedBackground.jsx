import { useEffect, useRef } from 'react';

const COLORS = {
  primary: '#4F7CFF',
  secondary: '#8B5CF6',
  accent: '#22C55E',
};

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ─── Resize ───────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Mouse tracking ───────────────────────────────────
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Orbs ─────────────────────────────────────────────
    // Large soft gradient blobs that lazily drift toward the cursor
    const orbs = [
      {
        x: window.innerWidth * 0.2,
        y: window.innerHeight * 0.25,
        r: 380,
        color: COLORS.primary,
        vx: 0.25,
        vy: 0.15,
        phase: 0,
      },
      {
        x: window.innerWidth * 0.8,
        y: window.innerHeight * 0.6,
        r: 320,
        color: COLORS.secondary,
        vx: -0.2,
        vy: 0.28,
        phase: 2,
      },
      {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.8,
        r: 260,
        color: COLORS.accent,
        vx: 0.18,
        vy: -0.22,
        phase: 4,
      },
    ];

    // ─── Particles ────────────────────────────────────────
    const colorKeys = Object.values(COLORS);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseOpacity: Math.random() * 0.45 + 0.15,
      opacity: 0,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: (Math.random() * 0.01) + 0.005,
    }));

    // ─── Draw loop ────────────────────────────────────────
    let tick = 0;

    const draw = () => {
      tick++;
      const { x: mx, y: my } = mouseRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // ── Orbs ──
      orbs.forEach((orb) => {
        orb.phase += 0.008;

        // Breathing pulse on radius
        const pulsedR = orb.r + Math.sin(orb.phase) * 30;

        // Gently attract to mouse
        const dx = mx - orb.x;
        const dy = my - orb.y;
        orb.vx += dx * 0.00004;
        orb.vy += dy * 0.00004;

        // Dampen so they don't fly off
        orb.vx *= 0.985;
        orb.vy *= 0.985;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Soft wrap-around edges
        if (orb.x < -pulsedR) orb.x = W + pulsedR;
        if (orb.x > W + pulsedR) orb.x = -pulsedR;
        if (orb.y < -pulsedR) orb.y = H + pulsedR;
        if (orb.y > H + pulsedR) orb.y = -pulsedR;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulsedR);
        grad.addColorStop(0, orb.color + '18');
        grad.addColorStop(0.5, orb.color + '09');
        grad.addColorStop(1, orb.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulsedR, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Particles ──
      particles.forEach((p, i) => {
        // Mouse proximity: gently attract within 180px
        const dxm = mx - p.x;
        const dym = my - p.y;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < 180) {
          const force = (180 - distMouse) / 180;
          p.vx += dxm * 0.00045 * force;
          p.vy += dym * 0.00045 * force;
        }

        // Dampen
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Twinkle opacity
        p.twinkle += p.twinkleSpeed;
        p.opacity = p.baseOpacity + Math.sin(p.twinkle) * 0.15;

        // Draw particle
        const hex = Math.floor(Math.max(0, Math.min(1, p.opacity)) * 255)
          .toString(16)
          .padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + hex;
        ctx.fill();

        // ── Connection lines between nearby particles ──
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dxp = p.x - q.x;
          const dyp = p.y - q.y;
          const distP = Math.sqrt(dxp * dxp + dyp * dyp);

          if (distP < 90) {
            const alpha = (1 - distP / 90) * 0.18;
            const hexLine = Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, '0');
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = COLORS.primary + hexLine;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      // ── Subtle cursor glow ──
      const cursorGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
      cursorGrad.addColorStop(0, COLORS.primary + '14');
      cursorGrad.addColorStop(1, COLORS.primary + '00');
      ctx.fillStyle = cursorGrad;
      ctx.beginPath();
      ctx.arc(mx, my, 120, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
}
