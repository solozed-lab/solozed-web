import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  baseRadius: number;
  radius: number;
  phaseX: number;
  phaseY: number;
  phaseSpeedX: number;
  phaseSpeedY: number;
  amplitudeX: number;
  amplitudeY: number;
  breathPhase: number;
  breathSpeed: number;
  breathAmount: number;
  opacity: number;
  color: string;
  offsetX: number;
  offsetY: number;
}

export default function OrbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // User prefers reduced motion - stop animation will happen on next render when component remounts
        cancelAnimationFrame(animationId);
      }
    };
    mediaQuery.addEventListener('change', handleMotionPreference);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000 };
    let orbs: Orb[] = [];
    let animationId: number;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createOrbs = () => {
      orbs = [];
      const count = 12 + Math.floor(Math.random() * 6);

      for (let i = 0; i < count; i++) {
        const baseRadius = 25 + Math.random() * 100;
        const orb: Orb = {
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: 0,
          baseY: 0,
          baseRadius,
          radius: baseRadius,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          phaseSpeedX: 0.08 + Math.random() * 0.12,
          phaseSpeedY: 0.06 + Math.random() * 0.1,
          amplitudeX: 50 + Math.random() * 100,
          amplitudeY: 40 + Math.random() * 80,
          breathPhase: Math.random() * Math.PI * 2,
          breathSpeed: 0.3 + Math.random() * 0.4,
          breathAmount: 0.15 + Math.random() * 0.1,
          opacity: 0.04 + Math.random() * 0.05,
          color: Math.random() > 0.5 ? '56, 217, 217' : '167, 243, 243',
          offsetX: 0,
          offsetY: 0,
        };
        orb.baseX = orb.x;
        orb.baseY = orb.y;
        orbs.push(orb);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      orbs.forEach((orb) => {
        orb.phaseX += orb.phaseSpeedX * 0.01;
        orb.phaseY += orb.phaseSpeedY * 0.01;

        const targetX = orb.baseX + Math.sin(orb.phaseX) * orb.amplitudeX;
        const targetY = orb.baseY + Math.cos(orb.phaseY) * orb.amplitudeY;

        orb.x += (targetX - orb.x) * 0.01;
        orb.y += (targetY - orb.y) * 0.01;

        orb.breathPhase += orb.breathSpeed * 0.01;
        const breathScale = 1 + Math.sin(orb.breathPhase) * orb.breathAmount;
        const currentRadius = orb.baseRadius * breathScale;

        const dx = orb.x - mouse.x;
        const dy = orb.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = orb.baseRadius * 4;

        if (dist < interactionRadius && dist > 0) {
          const force = Math.pow((interactionRadius - dist) / interactionRadius, 3);
          const pushStrength = 12;
          orb.offsetX += (dx / dist) * force * pushStrength;
          orb.offsetY += (dy / dist) * force * pushStrength;
        }

        orb.offsetX *= 0.994;
        orb.offsetY *= 0.994;

        const finalX = orb.x + orb.offsetX;
        const finalY = orb.y + orb.offsetY;

        const gradient = ctx.createRadialGradient(
          finalX, finalY, 0,
          finalX, finalY, currentRadius
        );
        gradient.addColorStop(0, `rgba(${orb.color}, ${orb.opacity})`);
        gradient.addColorStop(0.5, `rgba(${orb.color}, ${orb.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${orb.color}, 0)`);

        ctx.beginPath();
        ctx.arc(finalX, finalY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handleResize = () => {
      resize();
      createOrbs();
    };

    resize();
    createOrbs();
    draw();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      mediaQuery.removeEventListener('change', handleMotionPreference);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #F0FDFC 0%, #F5F8FA 40%, #F8FAFC 100%)',
        pointerEvents: 'none',
      }}
    />
  );
}
