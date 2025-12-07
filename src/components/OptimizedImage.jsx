import Image from 'next/image';
import { useState } from 'react';
import { Loader } from 'lucide-react';

/**
 * Optimized Image Component with Next.js Image optimization
 * Features: Lazy loading, blur placeholder, error handling, AVIF/WebP support
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  quality = 85,
  sizes,
  objectFit = 'cover',
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback image for errors
  const fallbackSrc = 'https://via.placeholder.com/300x450/1a1a2e/00f0ff?text=No+Image';

  return (
    <div className={`relative ${className}`}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <Loader className="w-8 h-8 text-[#00ff88] animate-spin" />
        </div>
      )}

      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={quality}
        priority={priority}
        sizes={sizes}
        className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

/**
 * Poster Image Component - Optimized for movie/TV posters
 */
export function PosterImage({ src, alt, className = '', priority = false }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      quality={90}
    />
  );
}

/**
 * Backdrop Image Component - Optimized for backdrop images
 */
export function BackdropImage({ src, alt, className = '', priority = false }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes="100vw"
      quality={85}
    />
  );
}

/**
 * Avatar Image Component - Optimized for profile pictures
 */
export function AvatarImage({ src, alt, size = 48, className = '' }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      sizes={`${size}px`}
      quality={90}
    />
  );
}

/**
 * Thumbnail Image Component - Optimized for video thumbnails
 */
export function ThumbnailImage({ src, alt, className = '', priority = false }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={80}
    />
  );
}
