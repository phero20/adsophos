import { useEffect, useRef } from 'react';

/**
 * Synthwave sunset background with retro grid — Canvas2D
 */
const AnimatedShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Visible but subtle mountains at the far left and far right edges
    const mountains = [
      { cx: -0.42, w: 0.15, h: 0.03 },
      { cx: -0.48, w: 0.2, h: 0.045 },
      { cx: 0.42, w: 0.12, h: 0.025 },
      { cx: 0.48, w: 0.22, h: 0.04 },
    ];

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; s: number; b: number }[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({ x: Math.random(), y: Math.random() * 0.5, s: Math.random() * 2 + 0.5, b: Math.random() });
    }

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const horizon = H * 0.58;

      // Sky — deep black to dark magenta
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#050505');
      skyGrad.addColorStop(0.4, '#0a0a0a');
      skyGrad.addColorStop(0.7, '#1a0515');
      skyGrad.addColorStop(1, '#2d0a1e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizon);

      // Stars
      stars.forEach((star) => {
        const twinkle = 0.3 + 0.7 * Math.sin(time * 2 + star.b * 10);
        ctx.fillStyle = `rgba(255, 215, 0, ${twinkle * 0.6})`;
        ctx.fillRect(star.x * W, star.y * H, star.s, star.s);
      });

      // Sun — large hot pink
      const sunCX = W * 0.5;
      const sunCY = horizon - H * 0.04;
      const sunR = Math.min(W, H) * 0.2;

      const sunGrad = ctx.createRadialGradient(sunCX, sunCY, 0, sunCX, sunCY, sunR);
      sunGrad.addColorStop(0, '#FFD700');
      sunGrad.addColorStop(0.3, '#FF6B35');
      sunGrad.addColorStop(0.6, '#FF2D78');
      sunGrad.addColorStop(1, 'rgba(255, 45, 120, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunCX, sunCY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Sun glow
      const glowGrad = ctx.createRadialGradient(sunCX, sunCY, sunR * 0.5, sunCX, sunCY, sunR * 2.5);
      glowGrad.addColorStop(0, 'rgba(255, 45, 120, 0.12)');
      glowGrad.addColorStop(1, 'rgba(255, 45, 120, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, horizon + 20);

      // Distant Mountains Silhouette (corners)
      ctx.fillStyle = '#0c0714';
      mountains.forEach(m => {
        const cx = sunCX + m.cx * W;
        const width = m.w * W;
        const peakY = horizon - m.h * H;
        ctx.beginPath();
        ctx.moveTo(cx - width, horizon + 2);
        ctx.lineTo(cx, peakY);
        ctx.lineTo(cx + width, horizon + 2);
        ctx.fill();
      });

      // Horizon line
      ctx.strokeStyle = '#FF2D78';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#FF2D78';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W, horizon);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground
      ctx.fillStyle = '#0a0505';
      ctx.fillRect(0, horizon, W, H - horizon);

      // Perspective grid — pink
      ctx.strokeStyle = 'rgba(255, 45, 120, 0.4)';
      ctx.lineWidth = 1;

      // Animated horizontal lines scrolling toward horizon
      const gridSpeed = 0.4;
      const totalLines = 20;
      const scrollOffset = (time * gridSpeed) % (1 / totalLines);

      for (let i = 0; i < totalLines; i++) {
        // t goes from 0 (horizon) to 1 (bottom), with scroll offset
        let t = (i / totalLines) + scrollOffset;
        if (t > 1) t -= 1;

        // Quadratic perspective: lines bunch up near horizon
        const y = horizon + t * t * (H - horizon);
        ctx.globalAlpha = 0.1 + t * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Vertical lines converging to center
      const vp = W * 0.5;
      ctx.globalAlpha = 0.3;
      for (let i = -20; i <= 20; i++) {
        const baseX = vp + i * (W / 20) * 1.5;
        ctx.beginPath();
        ctx.moveTo(vp, horizon);
        ctx.lineTo(baseX, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedShaderBackground;
