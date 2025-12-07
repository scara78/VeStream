import React from 'react';
import { THEME } from '@/constants/config';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#020617', padding: '4rem 5%', borderTop: `1px solid ${THEME.border}`, marginTop: 'auto' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div><h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ve<span style={{ color: THEME.accent }}>Stream</span></h3><p style={{ color: THEME.textDim, maxWidth: '300px', lineHeight: 1.6, fontSize: '0.9rem' }}>The ultimate streaming experience. High definition, zero latency, tailored for you.</p></div>
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div><h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '0.9rem' }}>BROWSE</h4><div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: THEME.textDim, fontSize: '0.85rem' }}><span>Trending</span><span>Top Rated</span></div></div>
          <div><h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '0.9rem' }}>SUPPORT</h4><div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: THEME.textDim, fontSize: '0.85rem' }}><span>Help Center</span><span>DMCA</span></div></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#475569', fontSize: '0.8rem' }}>© 2025 VeStream Inc.</span><div style={{ display: 'flex', gap: '1.5rem' }}><Github size={18} color="#64748b" /><Twitter size={18} color="#64748b" /><Heart size={18} color="#64748b" /></div></div>
    </div>
  </footer>
);
export default Footer;