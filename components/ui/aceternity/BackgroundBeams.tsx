'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BackgroundBeamsProps {
  className?: string;
}

/**
 * BackgroundBeams - Animated background beams with collision effect
 * 
 * @example
 * ```tsx
 * <BackgroundBeams className="absolute inset-0" />
 * ```
 */
export const BackgroundBeams: React.FC<BackgroundBeamsProps> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Beam configuration
    const beams: Array<{
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      opacity: number;
      width: number;
    }> = [];

    // Create beams
    for (let i = 0; i < 20; i++) {
      beams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 200 + 100,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        width: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beams.forEach((beam) => {
        // Update beam position
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        // Wrap around screen
        if (beam.x < -beam.length) beam.x = canvas.width + beam.length;
        if (beam.x > canvas.width + beam.length) beam.x = -beam.length;
        if (beam.y < -beam.length) beam.y = canvas.height + beam.length;
        if (beam.y > canvas.height + beam.length) beam.y = -beam.length;

        // Draw beam
        const gradient = ctx.createLinearGradient(
          beam.x,
          beam.y,
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        );

        gradient.addColorStop(0, `oklch(0.65 0.25 280 / 0)`);
        gradient.addColorStop(0.5, `oklch(0.65 0.25 280 / ${beam.opacity})`);
        gradient.addColorStop(1, `oklch(0.75 0.18 220 / 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        );
        ctx.stroke();
      });

      // Check for collisions and create explosion effects
      for (let i = 0; i < beams.length; i++) {
        for (let j = i + 1; j < beams.length; j++) {
          const beam1 = beams[i];
          const beam2 = beams[j];
          const distance = Math.sqrt(
            Math.pow(beam1.x - beam2.x, 2) + Math.pow(beam1.y - beam2.y, 2)
          );

          if (distance < 50) {
            // Create explosion effect
            const explosionGradient = ctx.createRadialGradient(
              beam1.x,
              beam1.y,
              0,
              beam1.x,
              beam1.y,
              30
            );
            explosionGradient.addColorStop(0, 'oklch(0.70 0.22 260 / 0.3)');
            explosionGradient.addColorStop(1, 'oklch(0.70 0.22 260 / 0)');

            ctx.fillStyle = explosionGradient;
            ctx.beginPath();
            ctx.arc(beam1.x, beam1.y, 30, 0, Math.PI * 2);
            ctx.fill();

            // Bounce beams away
            const angle = Math.atan2(beam2.y - beam1.y, beam2.x - beam1.x);
            beam1.angle = angle + Math.PI / 2;
            beam2.angle = angle - Math.PI / 2;
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ opacity: 0.3 }}
    />
  );
};

interface ShootingStarsProps {
  className?: string;
  starCount?: number;
}

/**
 * ShootingStars - Animated shooting stars background
 */
export const ShootingStars: React.FC<ShootingStarsProps> = ({
  className,
  starCount = 5,
}) => {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {[...Array(starCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 10,
            ease: 'linear',
          }}
        >
          {/* Star trail */}
          <motion.div
            className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      ))}
    </div>
  );
};
