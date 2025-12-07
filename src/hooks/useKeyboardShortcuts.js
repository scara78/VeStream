import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Keyboard Shortcuts Hook
 * Provides global keyboard shortcuts for better accessibility and UX
 */

const SHORTCUTS = {
  // Navigation
  SEARCH: ['/', 'ctrl+k', 'cmd+k'],
  HOME: ['h'],
  GO_BACK: ['escape'],

  // Video Player
  PLAY_PAUSE: ['space', 'k'],
  MUTE: ['m'],
  FULLSCREEN: ['f'],
  VOLUME_UP: ['arrowup'],
  VOLUME_DOWN: ['arrowdown'],
  SEEK_FORWARD: ['arrowright', 'l'],
  SEEK_BACKWARD: ['arrowleft', 'j'],
  SEEK_FORWARD_LONG: ['shift+arrowright'],
  SEEK_BACKWARD_LONG: ['shift+arrowleft'],
  NEXT_EPISODE: ['n'],
  PREVIOUS_EPISODE: ['p'],

  // Other
  SETTINGS: ['s'],
  HELP: ['?', 'shift+/'],
};

export default function useKeyboardShortcuts({
  onPlayPause,
  onMute,
  onFullscreen,
  onVolumeUp,
  onVolumeDown,
  onSeekForward,
  onSeekBackward,
  onNextEpisode,
  onPreviousEpisode,
  disabled = false,
} = {}) {
  const router = useRouter();

  const handleKeyPress = useCallback(
    (event) => {
      if (disabled) return;

      // Don't trigger shortcuts when typing in inputs
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const withCtrl = event.ctrlKey || event.metaKey;
      const withShift = event.shiftKey;

      // Build full key combination
      let combination = '';
      if (withCtrl) combination += 'ctrl+';
      if (withShift) combination += 'shift+';
      combination += key;

      // Navigation Shortcuts
      if (SHORTCUTS.SEARCH.includes(combination) || SHORTCUTS.SEARCH.includes(key)) {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      if (SHORTCUTS.HOME.includes(key)) {
        event.preventDefault();
        router.push('/');
        return;
      }

      if (SHORTCUTS.GO_BACK.includes(key)) {
        event.preventDefault();
        router.back();
        return;
      }

      // Video Player Shortcuts
      if (SHORTCUTS.PLAY_PAUSE.includes(key)) {
        event.preventDefault();
        onPlayPause?.();
        return;
      }

      if (SHORTCUTS.MUTE.includes(key)) {
        event.preventDefault();
        onMute?.();
        return;
      }

      if (SHORTCUTS.FULLSCREEN.includes(key)) {
        event.preventDefault();
        onFullscreen?.();
        return;
      }

      if (SHORTCUTS.VOLUME_UP.includes(key)) {
        event.preventDefault();
        onVolumeUp?.();
        return;
      }

      if (SHORTCUTS.VOLUME_DOWN.includes(key)) {
        event.preventDefault();
        onVolumeDown?.();
        return;
      }

      if (SHORTCUTS.SEEK_FORWARD.includes(key)) {
        event.preventDefault();
        onSeekForward?.(5); // 5 seconds
        return;
      }

      if (SHORTCUTS.SEEK_BACKWARD.includes(key)) {
        event.preventDefault();
        onSeekBackward?.(5); // 5 seconds
        return;
      }

      if (SHORTCUTS.SEEK_FORWARD_LONG.includes(combination)) {
        event.preventDefault();
        onSeekForward?.(30); // 30 seconds
        return;
      }

      if (SHORTCUTS.SEEK_BACKWARD_LONG.includes(combination)) {
        event.preventDefault();
        onSeekBackward?.(30); // 30 seconds
        return;
      }

      if (SHORTCUTS.NEXT_EPISODE.includes(key)) {
        event.preventDefault();
        onNextEpisode?.();
        return;
      }

      if (SHORTCUTS.PREVIOUS_EPISODE.includes(key)) {
        event.preventDefault();
        onPreviousEpisode?.();
        return;
      }

      // Other Shortcuts
      if (SHORTCUTS.HELP.includes(key) || SHORTCUTS.HELP.includes(combination)) {
        event.preventDefault();
        showKeyboardShortcutsModal();
        return;
      }
    },
    [
      disabled,
      router,
      onPlayPause,
      onMute,
      onFullscreen,
      onVolumeUp,
      onVolumeDown,
      onSeekForward,
      onSeekBackward,
      onNextEpisode,
      onPreviousEpisode,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { shortcuts: SHORTCUTS };
}

// Helper to show keyboard shortcuts modal
function showKeyboardShortcutsModal() {
  // This will be shown in a modal/dialog
  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['/', 'Ctrl+K'], description: 'Focus search' },
      { keys: ['H'], description: 'Go to homepage' },
      { keys: ['Esc'], description: 'Go back' },
    ]},
    { category: 'Video Player', items: [
      { keys: ['Space', 'K'], description: 'Play/Pause' },
      { keys: ['M'], description: 'Mute/Unmute' },
      { keys: ['F'], description: 'Fullscreen' },
      { keys: ['↑'], description: 'Volume up' },
      { keys: ['↓'], description: 'Volume down' },
      { keys: ['→', 'L'], description: 'Seek forward 5s' },
      { keys: ['←', 'J'], description: 'Seek backward 5s' },
      { keys: ['Shift+→'], description: 'Seek forward 30s' },
      { keys: ['Shift+←'], description: 'Seek backward 30s' },
      { keys: ['N'], description: 'Next episode' },
      { keys: ['P'], description: 'Previous episode' },
    ]},
    { category: 'Other', items: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ]},
  ];

  console.log('Keyboard Shortcuts:', shortcuts);
  // TODO: Implement modal UI
}

export { SHORTCUTS, showKeyboardShortcutsModal };
