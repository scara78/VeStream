'use client';

import React, { useState } from 'react';
import { Settings, X, User, Bell, Shield, Palette, Globe, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import usePreferencesStore from '@/store/usePreferences';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import * as Tabs from '@radix-ui/react-tabs';

/**
 * Settings Panel Component
 * User preferences and account settings
 */
export default function SettingsPanel({ trigger }) {
  const { settings, updateSettings, clearWatchHistory, resetPreferences } = usePreferencesStore();
  const [open, setOpen] = useState(false);

  const qualityOptions = ['360p', '480p', '720p', '1080p', 'Auto'];
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
  ];

  const handleExportData = () => {
    const data = JSON.stringify(usePreferencesStore.getState(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vestream-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-black/95 rounded-2xl border border-white/10 shadow-2xl z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#00ff88]" />
              Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="playback" className="w-full">
            <Tabs.List className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
              <Tabs.Trigger
                value="playback"
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] transition-colors"
              >
                Playback
              </Tabs.Trigger>
              <Tabs.Trigger
                value="appearance"
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] transition-colors"
              >
                Appearance
              </Tabs.Trigger>
              <Tabs.Trigger
                value="privacy"
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] transition-colors"
              >
                Privacy
              </Tabs.Trigger>
              <Tabs.Trigger
                value="data"
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] transition-colors"
              >
                Data
              </Tabs.Trigger>
            </Tabs.List>

            {/* Playback Tab */}
            <Tabs.Content value="playback" className="space-y-6">
              {/* Autoplay */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <h3 className="text-white font-semibold mb-1">Autoplay</h3>
                  <p className="text-gray-400 text-sm">Automatically play next episode</p>
                </div>
                <Switch.Root
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => updateSettings({ autoplay: checked })}
                  className="w-11 h-6 bg-white/20 rounded-full relative data-[state=checked]:bg-[#00ff88] transition-colors"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>

              {/* Default Quality */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Default Quality</h3>
                <div className="flex flex-wrap gap-2">
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => updateSettings({ defaultQuality: quality })}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        settings.defaultQuality === quality
                          ? 'bg-[#00ff88] text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitles */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <h3 className="text-white font-semibold mb-1">Subtitles</h3>
                  <p className="text-gray-400 text-sm">Show subtitles by default</p>
                </div>
                <Switch.Root
                  checked={settings.subtitles}
                  onCheckedChange={(checked) => updateSettings({ subtitles: checked })}
                  className="w-11 h-6 bg-white/20 rounded-full relative data-[state=checked]:bg-[#00ff88] transition-colors"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>

              {/* Data Saver */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <h3 className="text-white font-semibold mb-1">Data Saver</h3>
                  <p className="text-gray-400 text-sm">Reduce data usage with lower quality</p>
                </div>
                <Switch.Root
                  checked={settings.dataSaver}
                  onCheckedChange={(checked) => updateSettings({ dataSaver: checked })}
                  className="w-11 h-6 bg-white/20 rounded-full relative data-[state=checked]:bg-[#00ff88] transition-colors"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>
            </Tabs.Content>

            {/* Appearance Tab */}
            <Tabs.Content value="appearance" className="space-y-6">
              {/* Theme */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#00ff88]" />
                  Theme
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-[#00ff88] text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      settings.theme === 'light'
                        ? 'bg-[#00ff88] text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00ff88]" />
                  Language
                </h3>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value} className="bg-black">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </Tabs.Content>

            {/* Privacy Tab */}
            <Tabs.Content value="privacy" className="space-y-6">
              {/* Maturity Rating */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00ff88]" />
                  Maturity Rating
                </h3>
                <select
                  value={settings.maturityRating}
                  onChange={(e) => updateSettings({ maturityRating: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-[#00ff88]/50 focus:outline-none"
                >
                  <option value="all" className="bg-black">All Ages</option>
                  <option value="teen" className="bg-black">Teen (13+)</option>
                  <option value="mature" className="bg-black">Mature (17+)</option>
                  <option value="adult" className="bg-black">Adult (18+)</option>
                </select>
              </div>

              {/* Clear Watch History */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Clear Watch History</h3>
                <p className="text-gray-400 text-sm mb-4">Remove all items from your watch history</p>
                <Button
                  onClick={clearWatchHistory}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              </div>
            </Tabs.Content>

            {/* Data Tab */}
            <Tabs.Content value="data" className="space-y-6">
              {/* Export Data */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Export Your Data</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Download all your preferences, watch history, and saved items
                </p>
                <Button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/30 font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>

              {/* Reset All */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-2">Reset All Settings</h3>
                <p className="text-gray-400 text-sm mb-4">
                  This will reset all settings to default and clear all your data
                </p>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
                      resetPreferences();
                      setOpen(false);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset Everything
                </Button>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
