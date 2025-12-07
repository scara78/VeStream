'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Extract dominant colors from an image URL
 * Uses canvas-based color sampling with HSL analysis for vibrant color selection
 */

// Color utility functions
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

// Create color variants from a base color
const createColorVariants = (hex) => {
    // Parse hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const hsl = rgbToHsl(r, g, b);

    // Create vibrant version (increase saturation, adjust lightness)
    const vibrantHsl = {
        h: hsl.h,
        s: Math.min(100, hsl.s * 1.3),
        l: Math.max(40, Math.min(60, hsl.l))
    };
    const vibrantRgb = hslToRgb(vibrantHsl.h, vibrantHsl.s, vibrantHsl.l);
    const vibrant = rgbToHex(vibrantRgb.r, vibrantRgb.g, vibrantRgb.b);

    // Create glow color (same hue, higher saturation, medium lightness with alpha)
    const glowRgb = hslToRgb(hsl.h, Math.min(100, hsl.s * 1.2), 50);
    const glow = `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.5)`;

    // Create subtle version (lower opacity)
    const subtle = `rgba(${r}, ${g}, ${b}, 0.1)`;

    // Create muted version for backgrounds
    const mutedHsl = {
        h: hsl.h,
        s: Math.min(60, hsl.s * 0.6),
        l: 15
    };
    const mutedRgb = hslToRgb(mutedHsl.h, mutedHsl.s, mutedHsl.l);
    const muted = rgbToHex(mutedRgb.r, mutedRgb.g, mutedRgb.b);

    return {
        primary: vibrant,
        glow,
        subtle,
        muted,
        raw: { r, g, b, ...hsl }
    };
};

// Default green theme fallback
const DEFAULT_COLORS = {
    primary: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.5)',
    subtle: 'rgba(0, 255, 136, 0.1)',
    muted: '#004d26',
    raw: { r: 0, g: 255, b: 136, h: 152, s: 100, l: 50 }
};

// Cache for extracted colors
const colorCache = new Map();

/**
 * Hook to extract dominant colors from an image
 * @param {string} imageUrl - URL of the image to extract colors from
 * @param {string} fallbackHex - Optional hex color from API (avgHueLight/avgHueDark)
 * @returns {Object} Color variants object
 */
export function useColorExtraction(imageUrl, fallbackHex = null) {
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // If we have a fallback hex from the API, use it directly
        if (fallbackHex && fallbackHex.startsWith('#')) {
            try {
                const variants = createColorVariants(fallbackHex);
                setColors(variants);
                setIsLoading(false);
                return;
            } catch (e) {
                console.warn('Failed to parse fallback hex:', e);
            }
        }

        // Check cache first
        if (imageUrl && colorCache.has(imageUrl)) {
            setColors(colorCache.get(imageUrl));
            setIsLoading(false);
            return;
        }

        if (!imageUrl) {
            setColors(DEFAULT_COLORS);
            setIsLoading(false);
            return;
        }

        const extractColors = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Create an image element
                const img = new Image();
                img.crossOrigin = 'anonymous';

                const loadPromise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error('Failed to load image'));

                    // Timeout after 5 seconds
                    setTimeout(() => reject(new Error('Image load timeout')), 5000);
                });

                img.src = imageUrl;
                await loadPromise;

                // Create canvas if not exists
                if (!canvasRef.current) {
                    canvasRef.current = document.createElement('canvas');
                }
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Use smaller canvas for performance
                const sampleSize = 50;
                canvas.width = sampleSize;
                canvas.height = sampleSize;

                // Draw and sample the image
                ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
                const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

                // Collect color samples
                const colorSamples = [];
                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];

                    // Skip transparent pixels
                    if (a < 128) continue;

                    const hsl = rgbToHsl(r, g, b);

                    // Filter for vibrant colors (good saturation, not too dark/light)
                    if (hsl.s > 20 && hsl.l > 15 && hsl.l < 85) {
                        colorSamples.push({ r, g, b, ...hsl });
                    }
                }

                if (colorSamples.length === 0) {
                    // No vibrant colors found, use default
                    setColors(DEFAULT_COLORS);
                    setIsLoading(false);
                    return;
                }

                // Sort by saturation and pick the most vibrant
                colorSamples.sort((a, b) => b.s - a.s);

                // Group similar colors and find most common vibrant color
                const colorBuckets = {};
                colorSamples.forEach(color => {
                    // Round hue to nearest 10 degrees for grouping
                    const hueKey = Math.round(color.h / 10) * 10;
                    if (!colorBuckets[hueKey]) {
                        colorBuckets[hueKey] = { count: 0, colors: [] };
                    }
                    colorBuckets[hueKey].count++;
                    colorBuckets[hueKey].colors.push(color);
                });

                // Find the bucket with the most colors
                let dominantBucket = null;
                let maxCount = 0;
                Object.values(colorBuckets).forEach(bucket => {
                    if (bucket.count > maxCount) {
                        maxCount = bucket.count;
                        dominantBucket = bucket;
                    }
                });

                if (!dominantBucket) {
                    setColors(DEFAULT_COLORS);
                    setIsLoading(false);
                    return;
                }

                // Average the colors in the dominant bucket
                const avgColor = dominantBucket.colors.reduce((acc, color) => {
                    acc.r += color.r;
                    acc.g += color.g;
                    acc.b += color.b;
                    return acc;
                }, { r: 0, g: 0, b: 0 });

                avgColor.r = Math.round(avgColor.r / dominantBucket.colors.length);
                avgColor.g = Math.round(avgColor.g / dominantBucket.colors.length);
                avgColor.b = Math.round(avgColor.b / dominantBucket.colors.length);

                const dominantHex = rgbToHex(avgColor.r, avgColor.g, avgColor.b);
                const variants = createColorVariants(dominantHex);

                // Cache the result
                colorCache.set(imageUrl, variants);

                setColors(variants);
            } catch (err) {
                console.warn('Color extraction failed:', err.message);
                setError(err.message);

                // Try fallback if available
                if (fallbackHex && fallbackHex.startsWith('#')) {
                    try {
                        const variants = createColorVariants(fallbackHex);
                        setColors(variants);
                    } catch (e) {
                        setColors(DEFAULT_COLORS);
                    }
                } else {
                    setColors(DEFAULT_COLORS);
                }
            } finally {
                setIsLoading(false);
            }
        };

        extractColors();
    }, [imageUrl, fallbackHex]);

    return { colors, isLoading, error };
}

/**
 * Utility to parse avgHue fields from Gifted API
 * These come in format "#3f4c56"
 */
export function parseGiftedColor(avgHue) {
    if (!avgHue || typeof avgHue !== 'string') return null;
    if (avgHue.startsWith('#') && avgHue.length === 7) {
        return avgHue;
    }
    return null;
}

export default useColorExtraction;
