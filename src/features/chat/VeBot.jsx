import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { THEME, API_CONFIG } from '@/constants/config';
import { useNavigate } from 'react-router-dom';

const GENRE_MAP = {
  'action': 28, 'adventure': 12, 'comedy': 35, 'crime': 80, 'drama': 18,
  'fantasy': 14, 'horror': 27, 'romance': 10749, 'scifi': 878, 'thriller': 53
};

const VeBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: "Hi! I'm VeBot. Tell me what you're in the mood for." }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const processCommand = (text) => {
    const lower = text.toLowerCase();

    // Check for Genres
    for (const [key, id] of Object.entries(GENRE_MAP)) {
      if (lower.includes(key)) {
        setTimeout(() => {
          navigate(`/browse/${id}`);
          setMessages(prev => [...prev, { role: 'bot', text: `Navigating to ${key.charAt(0).toUpperCase() + key.slice(1)} movies...` }]);
        }, 1000);
        return `Searching the database for ${key}...`;
      }
    }

    // Check for specific keywords
    if (lower.includes('popular') || lower.includes('trending')) {
      setTimeout(() => navigate('/browse/new'), 1000);
      return "Showing you what's hot right now.";
    }

    // Default: Search Query
    setTimeout(() => navigate(`/search?q=${text}`), 1000); // We'll handle this param in App.jsx
    return `Searching VeStream for "${text}"...`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processCommand(userMsg);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', zIndex: 9990,
            width: '60px', height: '60px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${THEME.accent}, #06b6d4)`,
            boxShadow: `0 0 20px ${THEME.accent}60`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s', animation: 'float 3s ease-in-out infinite'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Bot size={28} color="#fff" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '30px', zIndex: 9990,
          width: '350px', height: '500px', background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '20px', border: `1px solid ${THEME.border}`,
          backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Header */}
          <div style={{ padding: '15px 20px', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={18} color={THEME.accent} />
              <span style={{ fontWeight: 700, color: '#fff' }}>VeBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: THEME.textDim, cursor: 'pointer' }}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  padding: '10px 15px', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.5,
                  background: m.role === 'user' ? THEME.accent : 'rgba(255,255,255,0.1)',
                  color: m.role === 'user' ? '#000' : '#fff',
                  borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: m.role === 'bot' ? '2px' : '12px'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '12px', borderBottomLeftRadius: '2px' }}>
                <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '15px', borderTop: `1px solid ${THEME.border}`, display: 'flex', gap: '10px' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask for a movie..."
              autoFocus
              style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50px', padding: '10px 20px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
            <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', background: THEME.accent, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={18} color="#000" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .typing-dot { display: inline-block; width: 6px; height: 6px; background: #fff; borderRadius: 50%; animation: typing 1.4s infinite ease-in-out both; margin: 0 2px; }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </>
  );
};

export default VeBot;