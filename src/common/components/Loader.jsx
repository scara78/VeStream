import React from 'react';
import { Zap } from 'lucide-react';
import { THEME } from '@/constants/config';

const Loader = () => (
    <div style={{
        height: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: THEME.bg, color: THEME.accent
    }}>
        <Zap size={64} className="animate-pulse" style={{ filter: `drop-shadow(${THEME.accentGlow})` }} />
        <p style={{ marginTop: '20px', color: THEME.textDim, letterSpacing: '2px', fontSize: '0.8rem' }}>
            INITIALIZING SYSTEM...
        </p>
        <style>{`
      .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.95); } }
    `}</style>
    </div>
);

export default Loader;