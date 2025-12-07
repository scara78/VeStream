import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { THEME } from '@/constants/config';

const VoiceSearch = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState('webkitSpeechRecognition' in window);

  const toggleListen = () => {
    if (!supported) return alert("Voice search not supported.");
    if (isListening) return setIsListening(false);

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => { onSearch(e.results[0][0].transcript); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  if (!supported) return null;
  return (
    <div onClick={toggleListen} title="Voice Search" style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', border: isListening ? '1px solid #ef4444' : `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}>
      {isListening ? <Mic size={18} color="#ef4444" /> : <MicOff size={18} color={THEME.textDim} />}
      <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }`}</style>
    </div>
  );
};
export default VoiceSearch;