'use client';

import React, { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/Badge';
import * as Dialog from '@radix-ui/react-dialog';

/**
 * Keyboard Shortcuts Help Modal
 * Shows all available keyboard shortcuts
 */
export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['/', 'Ctrl+K'], description: 'Focus search bar' },
        { keys: ['H'], description: 'Go to homepage' },
        { keys: ['Esc'], description: 'Go back / Close modal' },
      ],
    },
    {
      category: 'Video Player',
      items: [
        { keys: ['Space', 'K'], description: 'Play / Pause' },
        { keys: ['M'], description: 'Mute / Unmute' },
        { keys: ['F'], description: 'Toggle fullscreen' },
        { keys: ['↑'], description: 'Volume up' },
        { keys: ['↓'], description: 'Volume down' },
        { keys: ['→', 'L'], description: 'Seek forward 5 seconds' },
        { keys: ['←', 'J'], description: 'Seek backward 5 seconds' },
        { keys: ['Shift + →'], description: 'Seek forward 30 seconds' },
        { keys: ['Shift + ←'], description: 'Seek backward 30 seconds' },
        { keys: ['N'], description: 'Next episode' },
        { keys: ['P'], description: 'Previous episode' },
      ],
    },
    {
      category: 'Other',
      items: [
        { keys: ['?'], description: 'Show this help modal' },
      ],
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-black/95 rounded-2xl border border-white/10 shadow-2xl z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
              <Keyboard className="w-8 h-8 text-[#00ff88]" />
              Keyboard Shortcuts
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </Dialog.Close>
          </div>

          {/* Shortcuts List */}
          <div className="space-y-6">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="text-lg font-semibold text-[#00ff88] mb-3">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white text-sm">{shortcut.description}</span>
                      <div className="flex gap-2">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-3 py-1 text-xs font-mono font-semibold text-white bg-white/10 border border-white/20 rounded">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-500 text-sm">or</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 p-4 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30">
            <p className="text-sm text-gray-300 text-center">
              Press <kbd className="px-2 py-1 text-xs font-mono font-semibold text-white bg-white/10 border border-white/20 rounded">?</kbd> anytime to toggle this help
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
