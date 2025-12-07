import React from 'react';

/**
 * Revolutionary Neural Network Loading Animation
 * Cyberpunk-inspired loader with holographic effects
 */
const NeuralLoader = ({ size = 'md', variant = 'neural', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  if (variant === 'neural') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/30 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-neon-cyan rounded-full shadow-neon-cyan" />
        </div>

        {/* Middle rotating ring */}
        <div className="absolute inset-2 rounded-full border-2 border-neon-purple/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-neon-purple rounded-full shadow-neon-purple" />
        </div>

        {/* Inner pulsing core */}
        <div className="absolute inset-4 rounded-full bg-neon-cyan/20 animate-neural-pulse">
          <div className="absolute inset-2 rounded-full bg-neon-cyan/40" />
        </div>
      </div>
    );
  }

  if (variant === 'holo') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Holographic hexagon */}
        <div className="absolute inset-0 animate-holo-shift">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#9d00ff" />
                <stop offset="100%" stopColor="#ff00ff" />
              </linearGradient>
            </defs>
            <polygon
              points="50,5 90,30 90,70 50,95 10,70 10,30"
              fill="none"
              stroke="url(#holoGradient)"
              strokeWidth="3"
              className="animate-holo-glitch"
            />
            <polygon
              points="50,15 80,35 80,65 50,85 20,65 20,35"
              fill="url(#holoGradient)"
              opacity="0.2"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'cyber') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Cyberpunk bars */}
        <div className="flex items-end justify-center h-full gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-neon-magenta to-neon-cyan rounded-t animate-particle-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: '100%',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default: Spinner
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan animate-spin" />
    </div>
  );
};

/**
 * Full-Screen Neural Loading Overlay
 */
export const NeuralLoadingScreen = ({ message = 'Loading...', variant = 'neural' }) => {
  const [particles, setParticles] = React.useState([]);
  const [isMounted, setIsMounted] = React.useState(false);

  // Generate particles only on client-side to avoid hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
    setParticles(
      [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 3 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void-deep/95 backdrop-blur-xl">
      {/* Particle background */}
      <div className="absolute inset-0 opacity-30">
        {isMounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-particle-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader */}
      <div className="relative z-10">
        <NeuralLoader size="xl" variant={variant} />
      </div>

      {/* Loading message */}
      {message && (
        <div className="relative z-10 mt-8 text-center">
          <p className="text-xl font-bold holo-text tracking-wider uppercase">
            {message}
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-neon-cyan rounded-full animate-particle-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Inline Loading Skeleton with Neural Theme
 */
export const NeuralSkeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-64 w-full',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32 rounded-lg',
  };

  return (
    <div
      className={`relative overflow-hidden rounded bg-gradient-to-r from-void-neural via-neon-cyan/10 to-void-neural ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent animate-holo-scan" />
    </div>
  );
};

export default NeuralLoader;
