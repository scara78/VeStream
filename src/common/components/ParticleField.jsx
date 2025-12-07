import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Revolutionary Particle Field Component
 * Creates a cyberpunk neural network particle animation system
 */
const ParticleField = ({
  particleCount = 50,
  color = '#00f0ff',
  variant = 'float', // 'float', 'pulse', 'connect'
  speed = 1,
  size = 2,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Generate particles with random positions and velocities
  const initializeParticles = useMemo(() => {
    return () => {
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: size + Math.random() * 2,
          opacity: Math.random() * 0.5 + 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      return particles;
    };
  }, [particleCount, speed, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = initializeParticles();

    // Parse color
    const parseColor = (hexColor) => {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    };

    const colorRGB = parseColor(color);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Variant-specific behavior
        if (variant === 'pulse') {
          particle.pulsePhase += 0.05;
          particle.opacity = 0.3 + Math.sin(particle.pulsePhase) * 0.4;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${particle.opacity})`;
        ctx.fill();

        // Draw connections for 'connect' variant
        if (variant === 'connect') {
          particlesRef.current.slice(index + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              const opacity = (1 - distance / 150) * 0.3;
              ctx.strokeStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, variant, initializeParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Pre-built variants
export const NeuralParticleField = (props) => (
  <ParticleField color="#00f0ff" variant="connect" particleCount={30} speed={0.3} {...props} />
);

export const CyberParticleField = (props) => (
  <ParticleField color="#9d00ff" variant="pulse" particleCount={40} speed={0.5} {...props} />
);

export const HolographicParticleField = (props) => (
  <ParticleField color="#ff00ff" variant="float" particleCount={60} speed={0.4} {...props} />
);

export default ParticleField;
