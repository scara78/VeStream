'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Library, Search } from 'lucide-react';

/**
 * Main Navigation Component
 * Displays navigation links with active state
 */
export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
              ? 'bg-[#00ff88]/10 text-[#00ff88]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Mobile Navigation Component
 * Bottom navigation bar for mobile devices
 */
export function MobileNavigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pb-safe">
      <div className="flex items-center justify-around px-2 py-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-all duration-500 ${isActive ? 'text-[#00ff88]' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-[#00ff88]/10 rounded-xl blur-md -z-10 animate-pulse" />
              )}

              {/* Icon with spring animation */}
              <div className={`relative transition-all duration-500 ${isActive ? '-translate-y-1 scale-110' : ''}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]' : ''}`} />
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00ff88] rounded-full shadow-[0_0_5px_#00ff88]" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-bold tracking-wide transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
