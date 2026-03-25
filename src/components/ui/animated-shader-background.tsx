import { useEffect, useRef } from 'react';

/**
 * Synthwave sunset background — pure Canvas2D, no Three.js needed for this aesthetic.
 * Draws: gradient sky, large pink sun, city silhouette, perspective neon grid, stars, pixel clouds.
 */
const AnimatedShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars: { x: number; y: number; s: number; b: number }[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({ x: Math.random(), y: Math.random() * 0.5, s: Math.random() * 1.5 + 0.5, b: Math.random() });
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const horizon = H * 0.55;

      // Sky gradient (deep purple → dark blue → slight pink at horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#0a0a1a');
      skyGrad.addColorStop(0.3, '#1a1040');
      skyGrad.addColorStop(0.6, '#2d1b69');
      skyGrad.addColorStop(1, '#4a1942');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizon);

      // Stars
      stars.forEach((star) => {
        const twinkle = 0.4 + 0.6 * Math.sin(time * 2 + star.b * 10);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.fillRect(star.x * W, star.y * H, star.s, star.s);
      });

      // Sun
      const sunCenterX = W * 0.5;
      const sunCenterY = horizon - H * 0.08;
      const sunRadius = Math.min(W, H) * 0.18;

      const sunGrad = ctx.createRadialGradient(sunCenterX, sunCenterY, 0, sunCenterX, sunCenterY, sunRadius);
      sunGrad.addColorStop(0, '#ff69b4');
      sunGrad.addColorStop(0.4, '#ff1493');
      sunGrad.addColorStop(0.7, '#ff006e');
      sunGrad.addColorStop(1, 'rgba(255, 0, 110, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun horizontal scanlines (retro effect)
      for (let i = 0; i < 8; i++) {
        const y = sunCenterY - sunRadius + (i + 1) * (sunRadius * 2) / 9;
        if (y > sunCenterY - sunRadius && y < sunCenterY + sunRadius) {
          ctx.fillStyle = 'rgba(10, 10, 26, 0.4)';
          const lineH = 2 + i * 0.8;
          ctx.fillRect(sunCenterX - sunRadius, y, sunRadius * 2, lineH);
        }
      }

      // Sun glow
      const glowGrad = ctx.createRadialGradient(sunCenterX, sunCenterY, sunRadius * 0.8, sunCenterX, sunCenterY, sunRadius * 2);
      glowGrad.addColorStop(0, 'rgba(255, 105, 180, 0.15)');
      glowGrad.addColorStop(1, 'rgba(255, 105, 180, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, horizon + 20);

      // City silhouette
      ctx.fillStyle = '#0a0a1a';
      const buildings = [
        0.15, 0.22, 0.18, 0.30, 0.25, 0.35, 0.28, 0.42, 0.38, 0.45,
        0.50, 0.48, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.22, 0.18
      ];
      const bw = W / buildings.length;
      buildings.forEach((h, i) => {
        const bh = h * H * 0.25;
        const bx = i * bw;
        ctx.fillRect(bx, horizon - bh, bw - 1, bh);
        // Antenna on tall buildings
        if (h > 0.35) {
          ctx.fillRect(bx + bw / 2 - 1, horizon - bh - 10, 2, 10);
        }
      });

      // Horizon glow line
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W, horizon);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ground below horizon
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, H);
      groundGrad.addColorStop(0, '#1a0a2e');
      groundGrad.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, W, H - horizon);

      // Perspective grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 1;

      // Horizontal lines (receding with perspective)
      const numHLines = 15;
      for (let i = 1; i <= numHLines; i++) {
        const t = i / numHLines;
        const y = horizon + t * t * (H - horizon);
        ctx.globalAlpha = 0.3 + t * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Vertical lines (converging to vanishing point)
      const vp = W * 0.5;
      const numVLines = 20;
      ctx.globalAlpha = 0.4;
      for (let i = -numVLines; i <= numVLines; i++) {
        const baseX = vp + i * (W / numVLines) * 1.5;
        // Animate grid scrolling
        const offset = (time * 30) % (H - horizon);
        ctx.beginPath();
        ctx.moveTo(vp, horizon);
        ctx.lineTo(baseX, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Pixel clouds (8-bit style, floating)
      const drawPixelCloud = (cx: number, cy: number, scale: number) => {
        const s = scale;
        const py = cy + Math.sin(time * 0.5 + cx * 0.01) * 3;
        ctx.fillStyle = 'rgba(180, 130, 220, 0.25)';
        ctx.fillRect(cx, py, 20 * s, 6 * s);
        ctx.fillRect(cx + 4 * s, py - 4 * s, 12 * s, 4 * s);
        ctx.fillStyle = 'rgba(255, 150, 200, 0.2)';
        ctx.fillRect(cx + 6 * s, py - 6 * s, 8 * s, 3 * s);
      };

      drawPixelCloud(W * 0.08, H * 0.15, W * 0.004);
      drawPixelCloud(W * 0.65, H * 0.1, W * 0.003);
      drawPixelCloud(W * 0.35, H * 0.22, W * 0.005);
      drawPixelCloud(W * 0.85, H * 0.18, W * 0.003);

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
