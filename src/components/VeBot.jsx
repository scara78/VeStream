'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, X, Bot, Sparkles, Film, Tv, TrendingUp, Star, Search, Loader2 } from 'lucide-react';
import { useSearch, useTrending, useGenres } from '@/hooks/useMovieData';
import { trackVeBotQuery } from '@/lib/analytics';
import usePreferencesStore from '@/store/usePreferences';

const GENRE_MAP = {
  'action': 28, 'adventure': 12, 'animation': 16, 'comedy': 35, 'crime': 80,
  'documentary': 99, 'drama': 18, 'family': 10751, 'fantasy': 14, 'history': 36,
  'horror': 27, 'music': 10402, 'mystery': 9648, 'romance': 10749,
  'scifi': 878, 'science fiction': 878, 'thriller': 53, 'war': 10752, 'western': 37
};

const VeBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! I'm VeBot, your AI streaming assistant.\n\nI can help you:\n• Find movies by genre (\"action movies\")\n• Search for specific titles (\"find inception\")\n• Show trending content\n• Get recommendations\n• Browse by rating\n\nWhat are you in the mood for?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);
  const router = useRouter();
  const { addRecentSearch } = usePreferencesStore();

  // Draggable State
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  // Load position from localStorage
  useEffect(() => {
    const savedPos = localStorage.getItem('vebot_position');
    if (savedPos) {
      setPosition(JSON.parse(savedPos));
    }
  }, []);

  // React Query hooks
  const { data: searchResults, isLoading: isSearching } = useSearch(searchQuery);
  const { data: trendingData } = useTrending('all', 'week');
  const { data: genresData } = useGenres('movie');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Drag Handlers
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    // Get current button position if not set
    if (position.x === null) {
      const rect = e.currentTarget.getBoundingClientRect();
      initialPosRef.current = { x: rect.left, y: rect.top };
      setPosition({ x: rect.left, y: rect.top });
    } else {
      initialPosRef.current = { ...position };
    }

    setIsDragging(false);

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        setIsDragging(true);
        const newX = initialPosRef.current.x + dx;
        const newY = initialPosRef.current.y + dy;

        // Boundary checks
        const maxX = window.innerWidth - 64; // button width
        const maxY = window.innerHeight - 64; // button height

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };

    if (position.x === null) {
      const rect = e.currentTarget.getBoundingClientRect();
      initialPosRef.current = { x: rect.left, y: rect.top };
      setPosition({ x: rect.left, y: rect.top });
    } else {
      initialPosRef.current = { ...position };
    }

    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
      const newX = initialPosRef.current.x + dx;
      const newY = initialPosRef.current.y + dy;

      const maxX = window.innerWidth - 64;
      const maxY = window.innerHeight - 64;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // Save position when dragging stops (debounced)
  useEffect(() => {
    if (position.x !== null) {
      const timer = setTimeout(() => {
        localStorage.setItem('vebot_position', JSON.stringify(position));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [position]);

  const processCommand = async (text) => {
    const lower = text.toLowerCase();

    // Track query in analytics
    trackVeBotQuery(text, 'processing');

    // Check for trending/popular
    if (lower.includes('trending') || lower.includes('popular') || lower.includes('hot')) {
      setTimeout(() => router.push('/'), 1000);
      trackVeBotQuery(text, 'trending');
      return "🔥 Taking you to trending content right now!";
    }

    // Check for top rated
    if (lower.includes('top rated') || lower.includes('best') || lower.includes('highest rated')) {
      setTimeout(() => router.push('/?filter=top-rated'), 1000);
      trackVeBotQuery(text, 'top_rated');
      return "⭐ Showing you the highest-rated content!";
    }

    // Check for TV shows
    if (lower.includes('tv show') || lower.includes('series') || lower.includes('shows')) {
      setTimeout(() => router.push('/?type=tv'), 1000);
      trackVeBotQuery(text, 'tv_shows');
      return "📺 Loading TV shows for you!";
    }

    // Check for movies (general)
    if (lower.includes('movie') && !lower.includes('action') && !lower.includes('horror') && !lower.includes('find')) {
      setTimeout(() => router.push('/?type=movie'), 1000);
      trackVeBotQuery(text, 'movies');
      return "🎬 Showing you movies!";
    }

    // Check for genres
    for (const [key, id] of Object.entries(GENRE_MAP)) {
      if (lower.includes(key)) {
        setTimeout(() => router.push(`/search?genre=${id}`), 1000);
        trackVeBotQuery(text, `genre_${key}`);
        return `🎯 Finding ${key.charAt(0).toUpperCase() + key.slice(1)} content for you...`;
      }
    }

    // Check for specific movie/show search
    if (lower.includes('find') || lower.includes('search') || lower.includes('look for') || lower.includes('watch')) {
      const query = text.replace(/find|search|look for|watch|the|a|an/gi, '').trim();
      if (query.length >= 2) {
        // Use React Query to search
        setSearchQuery(query);
        addRecentSearch(query);

        // Wait a bit for results
        await new Promise(resolve => setTimeout(resolve, 500));

        setTimeout(() => router.push(`/search?q=${encodeURIComponent(query)}`), 1000);
        trackVeBotQuery(text, 'search');
        return `🔍 Searching for "${query}"... Found some great matches!`;
      }
    }

    // Check for recommendations
    if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('similar')) {
      trackVeBotQuery(text, 'recommendations');
      return "💡 Based on what's popular right now, I recommend checking out the trending section! You can also search for specific genres like 'action' or 'comedy'.";
    }

    // Check for help
    if (lower.includes('help') || lower.includes('what can you do')) {
      return "I can help you with:\n\n• Finding movies/shows (\"action movies\")\n• Searching titles (\"find batman\")\n• Showing trending content\n• Browsing by rating\n• Genre recommendations\n\nJust tell me what you're looking for!";
    }

    // Default: Search
    if (text.length >= 2) {
      addRecentSearch(text);
      setTimeout(() => router.push(`/search?q=${encodeURIComponent(text)}`), 1000);
      trackVeBotQuery(text, 'default_search');
      return `🔍 Searching for "${text}"...`;
    }

    return "🤔 I'm not sure what you're looking for. Try asking about genres (action, comedy), trending content, or search for a specific title!";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = await processCommand(userMsg);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 800);
  };

  const suggestedQueries = [
    { icon: TrendingUp, text: "What's trending?", query: "trending" },
    { icon: Star, text: "Top rated", query: "top rated" },
    { icon: Film, text: "Action movies", query: "action movies" },
    { icon: Tv, text: "TV shows", query: "tv shows" },
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={(e) => {
            if (!isDragging) setIsOpen(true);
          }}
          style={position.x !== null ? {
            left: position.x,
            top: position.y,
            bottom: 'auto',
            right: 'auto',
            transform: 'none' // Disable float animation while dragging/positioned
          } : {}}
          className={`fixed z-[9990] w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-xl border border-[#00ff88]/30 shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 group ${position.x === null ? 'bottom-24 right-4 animate-float' : ''}`}
          aria-label="Open VeBot"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 rounded-full border border-[#00ff88]/50 animate-pulse" />
          <Bot className="w-6 h-6 md:w-8 md:h-8 text-[#00ff88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-32 right-4 md:right-8 z-[9990] w-[calc(100vw-2rem)] md:w-[380px] h-[600px] max-h-[calc(100vh-10rem)] bg-black/90 backdrop-blur-2xl rounded-3xl border border-[#00ff88]/20 shadow-[0_0_50px_rgba(0,255,136,0.15)] flex flex-col animate-pop-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-cyan-400/20 border border-[#00ff88]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">VeBot AI</h3>
                <p className="text-gray-400 text-xs">Your Streaming Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close VeBot"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <p className="text-gray-400 text-xs mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQueries.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(item.query);
                    setTimeout(() => {
                      handleSend({ preventDefault: () => { } });
                    }, 100);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/50 border border-white/10 text-white text-xs transition-all"
                >
                  <item.icon className="w-4 h-4 text-[#00ff88]" />
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user'
                    ? 'bg-[#00ff88] text-black rounded-br-sm font-medium'
                    : 'bg-white/10 text-white rounded-bl-sm'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {isSearching && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Searching...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              autoFocus
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white text-sm placeholder-gray-400 outline-none focus:border-[#00ff88]/50 focus:bg-white/5 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-12 h-12 rounded-full bg-[#00ff88] hover:bg-[#00ff88]/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-black" />
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </>
  );
};

export default VeBot;
