/**
 * Accessibility Utilities
 * Helpers for WCAG 2.1 AA compliance
 */

/**
 * Announce to screen readers
 * Uses aria-live region for dynamic announcements
 */
export function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Trap focus within an element (for modals, dropdowns)
 */
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
}

/**
 * Generate unique ID for aria-labelledby
 */
let idCounter = 0;
export function generateId(prefix = 'vestream') {
    idCounter++;
    return `${prefix}-${idCounter}`;
}

/**
 * Format duration for screen readers
 */
export function formatDurationForScreenReader(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

    return parts.join(', ');
}

/**
 * Skip to main content
 */
export function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00ff88] focus:text-black focus:rounded-lg';

    document.body.insertBefore(skipLink, document.body.firstChild);
}

export default {
    announceToScreenReader,
    prefersReducedMotion,
    trapFocus,
    generateId,
    formatDurationForScreenReader,
    createSkipLink,
};
