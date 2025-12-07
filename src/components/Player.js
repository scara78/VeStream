"use client";

import React, { useRef, useState, useEffect } from 'react';
import { usePlayerControls } from '@/hooks/usePlayerControls';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Loader,
  PictureInPicture,
  Gauge,
  Download,
  Camera,
  FastForward
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

/**
 * Revolutionary Neural Interface Video Player
 * Features: Holographic UI, Neural Network Visualization, Dynamic Color Theming
 */
const Player = ({
  src,
  initialTime = 0,
  onProgressUpdate,
  accentColor = null,
  // Quality selection props
  videoSources = [],
  selectedQuality = '720p',
  onQualityChange = null,
  // Auto-play next episode callback (for TV shows)
  onVideoEnd = null,
  hasNextEpisode = false
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { playerState, togglePlay, handleScrub } = usePlayerControls(videoRef);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [settingsTab, setSettingsTab] = useState('quality'); // 'quality' or 'speed'
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [doubleTapSide, setDoubleTapSide] = useState(null); // 'left' or 'right' for seek animation
  const [showUpNext, setShowUpNext] = useState(false);
  const [upNextCountdown, setUpNextCountdown] = useState(10);
  const controlsTimeoutRef = useRef(null);
  const lastTapRef = useRef({ time: 0, x: 0 });
  const countdownRef = useRef(null);

  // Dynamic accent color (fallback to jungle green)
  const accent = accentColor?.primary || '#00ff88';
  const accentGlow = accentColor?.glow || 'rgba(0, 255, 136, 0.5)';
  const accentSubtle = accentColor?.subtle || 'rgba(0, 255, 136, 0.1)';


  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Volume control
  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(50);
        videoRef.current.volume = 0.5;
      }
    }
  };

  // Fullscreen control
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Picture-in-Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  };

  // Screenshot capture
  const takeScreenshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Download the screenshot
    const link = document.createElement('a');
    link.download = `screenshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download video
  const downloadVideo = () => {
    if (!src) return;

    const link = document.createElement('a');
    link.href = src;
    link.download = `video-${Date.now()}.mp4`;
    link.target = '_blank';
    link.click();
  };

  // Playback speed control
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const handleUserInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (playerState.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (!playerState.isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      handleUserInteraction();
    }
  }, [playerState.isPlaying]);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowleft':
          e.preventDefault();
          skip(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skip(10);
          break;
        case 'j':
          e.preventDefault();
          skip(-10);
          break;
        case 'l':
          e.preventDefault();
          skip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange([Math.min(100, volume + 10)]);
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 10)]);
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(prev => !prev);
          break;
        case 'escape':
          e.preventDefault();
          setShowKeyboardHelp(false);
          setShowSettings(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, togglePlay, toggleMute]);

  // Check PiP support
  useEffect(() => {
    setIsPiPSupported(document.pictureInPictureEnabled);
  }, []);



  // Set initial time
  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  // Progress reporting
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && onProgressUpdate && playerState.isPlaying) {
        onProgressUpdate({
          currentTime: videoRef.current.currentTime,
          duration: videoRef.current.duration
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [playerState.isPlaying, onProgressUpdate]);

  // Buffering detection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Video ended handler (auto-play next episode)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Clear any countdown
      if (countdownRef.current) clearInterval(countdownRef.current);
      setShowUpNext(false);

      if (onVideoEnd && hasNextEpisode) {
        onVideoEnd();
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [onVideoEnd, hasNextEpisode]);

  // Up Next countdown (show 30s before end for TV shows)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasNextEpisode) return;

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;

      // Show Up Next when 30 seconds remaining
      if (timeRemaining <= 30 && timeRemaining > 0 && !showUpNext) {
        setShowUpNext(true);
        setUpNextCountdown(Math.floor(timeRemaining));

        // Start countdown
        countdownRef.current = setInterval(() => {
          setUpNextCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [hasNextEpisode, showUpNext]);

  // Double-tap to seek (mobile gesture)
  const handleDoubleTap = (e) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current.time;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const relativeX = x - rect.left;
    const isLeftSide = relativeX < rect.width / 2;

    if (timeDiff < 300 && Math.abs(x - lastTapRef.current.x) < 50) {
      // Double tap detected
      if (isLeftSide) {
        skip(-10);
        setDoubleTapSide('left');
      } else {
        skip(10);
        setDoubleTapSide('right');
      }
      setTimeout(() => setDoubleTapSide(null), 500);
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x };
    }
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onTouchEnd={handleDoubleTap}
      onClick={handleUserInteraction}
    >
      {/* Neural Network Background Effect - Dynamic Color */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${accentSubtle}, transparent, transparent)`
          }}
        />
      </div>

      {/* Double-Tap Seek Indicator */}
      {doubleTapSide && (
        <div className={`absolute inset-y-0 ${doubleTapSide === 'left' ? 'left-0' : 'right-0'} w-1/3 flex items-center justify-center pointer-events-none z-30`}>
          <div
            className="flex flex-col items-center gap-1 animate-pulse"
            style={{ color: accent }}
          >
            <div className="text-4xl font-bold">{doubleTapSide === 'left' ? '⏪' : '⏩'}</div>
            <div className="text-sm font-bold">10 sec</div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Overlay */}
      {showKeyboardHelp && (
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div className="bg-black/80 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⌨️ Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300"><span>Play/Pause</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space / K</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Mute</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">M</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Fullscreen</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">F</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Seek -10s</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">← / J</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Seek +10s</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">→ / L</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Volume Up</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">↑</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Volume Down</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">↓</kbd></div>
              <div className="flex justify-between text-gray-300"><span>Close</span><kbd className="px-2 py-1 bg-white/10 rounded text-xs">Esc</kbd></div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Press ? to toggle this help</p>
          </div>
        </div>
      )}

      {/* Up Next Countdown Overlay (TV Shows) */}
      {showUpNext && hasNextEpisode && (
        <div className="absolute bottom-24 right-4 z-40 animate-slide-up">
          <div
            className="bg-black/90 backdrop-blur-xl border rounded-xl p-4 shadow-2xl min-w-[200px]"
            style={{ borderColor: `${accent}33` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: accentSubtle,
                  color: accent,
                  boxShadow: `0 0 20px ${accentGlow}`
                }}
              >
                {upNextCountdown}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Up Next</p>
                <p className="text-white font-bold">Next Episode</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setShowUpNext(false);
                }}
                className="flex-1 px-3 py-2 text-xs font-bold rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setShowUpNext(false);
                  if (onVideoEnd) onVideoEnd();
                }}
                className="flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors"
                style={{ backgroundColor: accent, color: 'black' }}
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Buffering Indicator - Dynamic Color */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full border-4 animate-ping"
                style={{ borderColor: accentSubtle }}
              />
              <Loader
                className="w-16 h-16 animate-spin"
                style={{ color: accent, filter: `drop-shadow(0 0 10px ${accentGlow})` }}
              />
            </div>
            <span
              className="font-bold tracking-widest uppercase text-sm animate-pulse"
              style={{ color: accent }}
            >
              Buffering...
            </span>
          </div>
        </div>
      )}

      {/* Center Play/Pause Overlay - Dynamic Color */}
      {!playerState.isPlaying && !isBuffering && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          onClick={togglePlay}
        >
          <div
            className="group/play w-24 h-24 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: `${accent}80`,
              boxShadow: `0 0 30px ${accentSubtle}`
            }}
          >
            <Play
              className="w-10 h-10 ml-1 fill-current"
              style={{ color: accent, filter: `drop-shadow(0 0 10px ${accentGlow})` }}
            />
          </div>
        </div>
      )}

      {/* Holographic Control Panel */}
      {/* Holographic Control Panel */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-32 pb-6 px-4 md:px-6 transition-opacity duration-500 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* Progress Bar with Neural Glow */}
        <div className="mb-6 group/slider relative">
          <Slider
            value={[playerState.progress]}
            onValueChange={handleScrub}
            max={100}
            step={0.1}
            variant="video"
            className="w-full"
          />
        </div>

        {/* Control Bar */}
        <div className="flex items-center gap-4">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause - Dynamic Color */}
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-white transition-all"
              style={{ '--hover-bg': accentSubtle }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentSubtle}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {playerState.isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current" />
              )}
            </Button>

            {/* Skip Controls */}
            <div className="flex items-center gap-1">
              <Button
                onClick={() => skip(-10)}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => skip(10)}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Time Display - Dynamic Color */}
            <div className="flex items-center gap-1 text-sm font-medium font-mono ml-2">
              <span style={{ color: accent, filter: `drop-shadow(0 0 5px ${accentGlow})` }}>
                {formatTime(videoRef.current?.currentTime || 0)}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-300">
                {formatTime(playerState.duration)}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Volume Control */}
          </div>

          {/* Volume Control - Hidden on mobile, simplified */}
          <div className="flex items-center gap-2 group/volume bg-black/40 backdrop-blur-sm rounded-full p-1 border border-white/5 hover:border-white/10 transition-colors">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full hover:bg-white/10"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-red-400" />
              ) : (
                <Volume2 className="h-4 w-4" style={{ color: accent }} />
              )}
            </Button>

            <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 pr-2 hidden md:block">
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:bg-white [&>span]:h-1 [&_[role=track]>span]:bg-[#00ff88]"
              />
            </div>
          </div>

          {/* Playback Speed */}
          <div className="relative">
            <Button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              title={`Speed: ${playbackRate}x`}
            >
              <Gauge className="h-5 w-5" />
            </Button>

            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 min-w-[120px] shadow-2xl animate-slide-up">
                <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">Speed</div>
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changePlaybackRate(speed)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${playbackRate === speed
                      ? 'font-bold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    style={playbackRate === speed ? { backgroundColor: accentSubtle, color: accent } : {}}
                  >
                    {speed}x
                    {playbackRate === speed && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 5px ${accent}` }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Picture-in-Picture */}
          {isPiPSupported && (
            <Button
              onClick={togglePiP}
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
              title="Picture-in-Picture"
            >
              <PictureInPicture className="h-5 w-5" />
            </Button>
          )}

          {/* Screenshot */}
          <Button
            onClick={takeScreenshot}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full hover:bg-white/10 text-gray-300 hover:text-white hidden md:flex"
            title="Take Screenshot"
          >
            <Camera className="h-5 w-5" />
          </Button>

          {/* Download */}
          <Button
            onClick={downloadVideo}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full hover:bg-white/10 text-gray-300 hover:text-white hidden md:flex"
            title="Download Video"
          >
            <Download className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <div className="relative">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-white/10 text-gray-300 hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-3 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl min-w-[200px] shadow-2xl animate-slide-up overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setSettingsTab('quality')}
                    className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${settingsTab === 'quality' ? 'border-b-2' : 'text-gray-400 hover:text-white'}`}
                    style={settingsTab === 'quality' ? { color: accent, borderColor: accent } : {}}
                  >
                    Quality
                  </button>
                  <button
                    onClick={() => setSettingsTab('speed')}
                    className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${settingsTab === 'speed' ? 'border-b-2' : 'text-gray-400 hover:text-white'}`}
                    style={settingsTab === 'speed' ? { color: accent, borderColor: accent } : {}}
                  >
                    Speed
                  </button>
                </div>

                {/* Quality Tab */}
                {settingsTab === 'quality' && (
                  <div className="p-2 max-h-[200px] overflow-y-auto">
                    {videoSources.length > 0 ? (
                      videoSources.map((source, index) => (
                        <button
                          key={`${source.quality}-${index}`}
                          onClick={() => {
                            if (onQualityChange) {
                              onQualityChange(source.quality);
                            }
                            setShowSettings(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${selectedQuality === source.quality ? 'font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                          style={selectedQuality === source.quality ? { backgroundColor: accentSubtle, color: accent } : {}}
                        >
                          <span>{source.quality}</span>
                          {selectedQuality === source.quality && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No quality options
                      </div>
                    )}
                  </div>
                )}

                {/* Speed Tab */}
                {settingsTab === 'speed' && (
                  <div className="p-2">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          changePlaybackRate(speed);
                          setShowSettings(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${playbackRate === speed ? 'font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        style={playbackRate === speed ? { backgroundColor: accentSubtle, color: accent } : {}}
                      >
                        <span>{speed}x</span>
                        {playbackRate === speed && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fullscreen - Dynamic Color */}
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full text-white transition-all"
            style={{ '--hover-bg': accentSubtle }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentSubtle; e.currentTarget.style.color = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>

  );
};

export default Player;