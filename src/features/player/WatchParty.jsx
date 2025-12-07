import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, X } from 'lucide-react';
import { THEME } from '@/constants/config';

const WatchParty = ({ onClose }) => {
  const [messages, setMessages] = useState([{ user: "System", text: "Connected to room.", color: THEME.accent }]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: "You", text: input, color: "#fff" }]);
    setInput('');
  };

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '300px', background: 'rgba(2, 6, 23, 0.9)', borderLeft: `1px solid ${THEME.border}`, backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', zIndex: 50, animation: 'slideLeft 0.3s ease' }}>
      <div style={{ padding: '15px', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: THEME.accent }}><Users size={18} /><span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Watch Party</span></div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m, i) => (<div key={i} style={{ fontSize: '0.85rem' }}><span style={{ color: m.color, fontWeight: 700, marginRight: '8px' }}>{m.user}:</span><span style={{ color: '#e2e8f0' }}>{m.text}</span></div>))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ padding: '15px', borderTop: `1px solid ${THEME.border}`, display: 'flex', gap: '10px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Chat..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', color: '#fff', padding: '8px 12px', fontSize: '0.9rem', outline: 'none' }} />
        <button type="submit" style={{ background: THEME.accent, border: 'none', borderRadius: '4px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Send size={16} color="#000" /></button>
      </form>
      <style>{`@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};
export default WatchParty;