import React from 'react';
import { THEME } from '@/constants/config';

const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  variant = 'rectangular',
  animation = 'wave',
  style,
  className = '',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: '50%',
          width: height,
        };
      case 'text':
        return {
          height: '1em',
          marginBottom: '0.5em',
          transform: 'scale(1, 0.6)',
        };
      case 'rectangular':
      default:
        return {};
    }
  };

  const getAnimationType = () => {
    switch (animation) {
      case 'pulse':
        return 'skeleton-pulse 1.5s ease-in-out infinite';
      case 'wave':
        return 'skeleton-wave 1.8s ease-in-out infinite';
      case false:
        return 'none';
      default:
        return 'skeleton-wave 1.8s ease-in-out infinite';
    }
  };

  const baseStyles = {
    width,
    height,
    borderRadius,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    backgroundImage:
      animation === 'wave'
        ? 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.9) 20%, rgba(30, 41, 59, 0.8) 40%)'
        : 'none',
    backgroundSize: '400px 100%',
    backgroundPosition: '-400px 0',
    animation: getAnimationType(),
    display: 'inline-block',
    lineHeight: 1,
    position: 'relative',
    overflow: 'hidden',
    ...getVariantStyles(),
    ...style,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton ${className}`}
      style={baseStyles}
      aria-busy="true"
      aria-live="polite"
      role="status"
    />
  ));

  return (
    <>
      {skeletons}
      <style>{`
        @keyframes skeleton-wave {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .skeleton::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(${THEME.accent}, 0.05),
            transparent
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton {
            animation: none !important;
            background-image: none !important;
          }
        }
      `}</style>
    </>
  );
};

// Pre-built skeleton variants for common use cases
export const SkeletonCard = ({ width = '100%', height = '300px' }) => (
  <div style={{ width, display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Skeleton width={width} height={height} borderRadius="16px" />
    <Skeleton width="80%" height="20px" />
    <Skeleton width="60%" height="16px" />
  </div>
);

export const SkeletonText = ({ lines = 3, width = '100%' }) => (
  <div style={{ width }}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '70%' : '100%'}
        height="16px"
        style={{ marginBottom: '8px' }}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = '48px' }) => (
  <Skeleton width={size} height={size} variant="circular" />
);

export const SkeletonButton = ({ width = '120px', height = '40px' }) => (
  <Skeleton width={width} height={height} borderRadius="8px" />
);

export const SkeletonRow = ({ columns = 4, gap = '16px' }) => (
  <div style={{ display: 'flex', gap, width: '100%' }}>
    {Array.from({ length: columns }, (_, i) => (
      <SkeletonCard key={i} width={`calc((100% - ${gap} * ${columns - 1}) / ${columns})`} />
    ))}
  </div>
);

export default Skeleton;