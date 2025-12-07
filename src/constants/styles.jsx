import React from 'react';
import { THEME } from './config';

export const GlobalCss = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;800&display=swap');

    :root {
      --bg: ${THEME.bg};
      --surface: ${THEME.surface};
      --accent: ${THEME.accent};
      --text: ${THEME.text};
      --text-dim: ${THEME.textDim};
      --border: ${THEME.border};
      
      /* PHYSICS */
      --ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    /* --- RESET --- */
    * { box-sizing: border-box; outline: none; -webkit-tap-highlight-color: transparent; }
    
    html, body, #root {
      margin: 0; padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      width: 100%;
      min-height: 100vh;
    }

    /* --- ZENITH BACKGROUND (No more Cyberpunk Green) --- */
    .zenith-bg {
      position: fixed; inset: 0; z-index: -2;
      background: var(--bg);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08), transparent 40%), /* Indigo */
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08), transparent 40%); /* Violet */
      pointer-events: none;
    }

    .noise-overlay {
      position: fixed; inset: 0; z-index: -1;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    /* --- TYPOGRAPHY --- */
    h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
    
    /* --- UTILITIES --- */
    .flex-center { display: flex; alignItems: center; justifyContent: center; }
    
    .glass-panel {
      background: rgba(15, 17, 21, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border);
    }

    /* --- COMPONENTS --- */

    /* 1. BUTTONS */
    .btn-hero {
      background: #ffffff; color: #000;
      padding: 14px 36px; border-radius: 12px;
      font-weight: 700; font-size: 1.05rem;
      border: none; cursor: pointer; display: inline-flex; alignItems: center; gap: 10px;
      transition: all 0.3s var(--ease-out);
      box-shadow: 0 0 30px rgba(255,255,255,0.15);
    }
    .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(255,255,255,0.25); }
    
    .btn-glass {
      background: rgba(255,255,255,0.08); color: #fff;
      padding: 14px 24px; border-radius: 12px;
      font-weight: 600; font-size: 1rem;
      border: 1px solid rgba(255,255,255,0.05);
      cursor: pointer; display: inline-flex; alignItems: center; gap: 10px;
      backdrop-filter: blur(10px); transition: all 0.3s var(--ease-out);
    }
    .btn-glass:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); border-color: rgba(255,255,255,0.2); }

    /* 2. CARDS */
    .poster-card {
      position: relative; border-radius: 12px; overflow: hidden;
      aspect-ratio: 2/3; cursor: pointer;
      transition: all 0.4s var(--ease-out);
      background: var(--surface);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .poster-card img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s var(--ease-out); }
    .poster-card::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
      opacity: 0; transition: 0.4s;
    }
    .poster-card:hover { transform: scale(1.05) translateY(-5px); z-index: 10; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.7); }
    .poster-card:hover img { transform: scale(1.1); }
    .poster-card:hover::after { opacity: 1; }

    .card-info {
      position: absolute; bottom: 0; left: 0; right: 0; padding: 15px;
      z-index: 2; transform: translateY(10px); opacity: 0; transition: 0.4s var(--ease-out);
    }
    .poster-card:hover .card-info { transform: translateY(0); opacity: 1; }

    /* 3. INPUTS */
    .glass-input {
      background: rgba(255,255,255,0.03); border: 1px solid var(--border);
      color: #fff; padding: 12px 20px; border-radius: 50px;
      font-family: inherit; width: 100%; transition: 0.3s;
    }
    .glass-input:focus {
      border-color: var(--accent); background: rgba(0,0,0,0.4);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    /* 4. ANIMATIONS */
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    /* 5. TRAILER MASK */
    .trailer-mask {
      mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    }
    
    /* 6. SCROLLBARS */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
  `}</style>
);