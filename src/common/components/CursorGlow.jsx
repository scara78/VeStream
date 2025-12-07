import React, { useEffect, useState } from 'react';

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setHidden(false);
    const leave = () => setHidden(true);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', enter);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9998,
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(16, 185, 129, 0.06), transparent 80%)`,
        opacity: hidden ? 0 : 1, transition: 'opacity 0.3s ease'
    }} />
  );
};
export default CursorGlow;