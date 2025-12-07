import { useState, useEffect, useCallback, useRef } from 'react';

export const usePlayerControls = (videoRef) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
    volume: 1,
    duration: 0,
    isFullScreen: false,
  });

  const togglePlay = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setPlayerState(prev => ({ ...prev, progress }));
  }, [videoRef]);

  const handleScrub = useCallback((value) => {
    const scrubTime = (value[0] / 100) * playerState.duration;
    videoRef.current.currentTime = scrubTime;
    setPlayerState(prev => ({ ...prev, progress: value[0] }));
  }, [videoRef, playerState.duration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    playerState.isPlaying ? video.play() : video.pause();
  }, [playerState.isPlaying, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setPlayerState(prev => ({ ...prev, duration: video.duration }));

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef, handleTimeUpdate]);

  return { playerState, togglePlay, handleScrub };
};