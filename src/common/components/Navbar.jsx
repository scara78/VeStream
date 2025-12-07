import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VoiceSearch from '@/features/browse/VoiceSearch';
import { THEME, API_CONFIG } from '@/constants/config';

const Navbar = ({ onSearch, isScrolled, profile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  // Instant Search State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`${API_CONFIG.TMDB_BASE}/search/multi?api_key=${API_CONFIG.TMDB_KEY}&query=${encodeURIComponent(query)}`);
          const data = await res.json();
          const filtered = data.results?.filter(i => i.media_type === 'movie' || i.media_type === 'tv').slice(0, 5) || [];
          setResults(filtered);
          setShowDropdown(true);
        } catch (e) { console.error(e); }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/watch/${item.media_type}/${item.id}`);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      setShowDropdown(false);
      onSearch(query);
      navigate('/search');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>

      {/* --- LEFT SIDE: LOGO & LINKS --- */}
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <img
              src="/logo.png"
              alt="VeStream"
              onError={(e) => { e.target.style.display = 'none' }}
              className="logo-img"
            />
            <span className="logo-text">
              Ve<span className="text-accent">Stream</span>
            </span>
          </div>
        </Link>

        <div className="nav-links desktop-only">
          {['Movies', 'Series', 'New & Popular', 'My Library'].map((item, index) => {
            const paths = ['/browse/movie', '/browse/tv', '/browse/new', '/library'];
            return (
              <Link
                key={item}
                to={paths[index]}
                className={`nav-link ${isActive(paths[index]) ? 'active' : ''}`}
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- RIGHT SIDE: SEARCH, BELL, PROFILE --- */}
      <div className="nav-right">

        <div className="search-container desktop-only" ref={searchRef}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              placeholder="Search titles, people, genres..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
              onKeyDown={handleEnter}
              onFocus={() => query.length > 2 && setShowDropdown(true)}
              className="search-input"
            />
            {query && <X size={14} className="clear-icon" onClick={() => { setQuery(''); setResults([]); }} />}
          </div>

          {/* INSTANT RESULTS DROPDOWN */}
          {showDropdown && results.length > 0 && (
            <div className="search-dropdown animate-fade-in">
              {results.map(item => (
                <div key={item.id} className="search-item" onClick={() => handleSelect(item)}>
                  <img
                    src={item.poster_path ? `${API_CONFIG.TMDB_POSTER}${item.poster_path}` : 'https://via.placeholder.com/50x75'}
                    alt={item.title || item.name}
                  />
                  <div className="search-item-info">
                    <span className="title">{item.title || item.name}</span>
                    <span className="meta">{item.media_type === 'movie' ? 'Movie' : 'TV Series'} • {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                  </div>
                </div>
              ))}
              <div className="search-footer" onClick={() => { setShowDropdown(false); navigate('/search'); }}>
                See all results for "{query}"
              </div>
            </div>
          )}

          <VoiceSearch onSearch={(q) => { setQuery(q); onSearch(q); }} />
        </div>

        <div className="nav-icons">
          <Bell size={20} className="nav-icon" />

          <Link to="/settings">
            <div className="profile-avatar">
              <img
                src={profile?.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
              />
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .navbar {
            position: fixed; top: 0; left: 0; width: 100%; z-index: 50;
            padding: 1rem 4%; display: flex; justify-content: space-between; align-items: center;
            transition: all 0.4s ease;
            background: transparent;
        }
        .navbar.scrolled {
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-subtle);
            padding: 0.8rem 4%;
        }

        .nav-left, .nav-right { display: flex; align-items: center; }
        .nav-left { gap: 30px; }
        .nav-right { gap: 2rem; }

        .logo-container { display: flex; align-items: center; gap: 12px; }
        .logo-img { height: 40px; width: auto; filter: drop-shadow(0 0 10px var(--accent-glow)); }
        .logo-text { font-size: 1.5rem; fontWeight: 800; letter-spacing: -0.5px; color: #fff; }
        .text-accent { color: var(--accent-primary); }

        .nav-links { gap: 25px; }
        .nav-link {
            color: var(--text-secondary); text-decoration: none; font-weight: 600; 
            font-size: 0.95rem; transition: 0.2s;
        }
        .nav-link:hover, .nav-link.active { color: #fff; }

        .search-container { display: flex; align-items: center; gap: 10px; width: 320px; position: relative; }
        .search-wrapper { position: relative; flex: 1; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .clear-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); cursor: pointer; }
        .search-input {
            width: 100%; padding: 10px 35px 10px 45px; border-radius: 50px;
            border: 1px solid var(--border-subtle); background: rgba(255,255,255,0.05);
            color: #fff; outline: none; font-size: 0.9rem; transition: 0.3s;
        }
        .search-input:focus {
            border-color: var(--accent-primary);
            background: rgba(15, 23, 42, 0.9);
        }

        .search-dropdown {
            position: absolute; top: 100%; left: 0; right: 0; margin-top: 10px;
            background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .search-item {
            display: flex; gap: 12px; padding: 10px; cursor: pointer; transition: 0.2s;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .search-item:hover { background: rgba(255,255,255,0.05); }
        .search-item img { width: 40px; height: 60px; object-fit: cover; border-radius: 4px; }
        .search-item-info { display: flex; flexDirection: column; justify-content: center; }
        .search-item-info .title { color: #fff; font-size: 0.9rem; font-weight: 600; }
        .search-item-info .meta { color: #94a3b8; font-size: 0.75rem; }
        .search-footer {
            padding: 10px; text-align: center; color: ${THEME.accent}; font-size: 0.85rem;
            font-weight: 600; cursor: pointer; background: rgba(0,0,0,0.2);
        }
        .search-footer:hover { background: rgba(0,0,0,0.4); }

        .nav-icons { display: flex; align-items: center; gap: 1.5rem; }
        .nav-icon { color: #fff; cursor: pointer; transition: 0.2s; }
        .nav-icon:hover { color: var(--accent-primary); }

        .profile-avatar {
            width: 38px; height: 38px; border-radius: 8px; overflow: hidden;
            cursor: pointer; border: 2px solid transparent; transition: 0.2s;
        }
        .profile-avatar:hover { border-color: var(--accent-primary); }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .desktop-only { display: none; }
        @media (min-width: 1024px) {
            .desktop-only { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;