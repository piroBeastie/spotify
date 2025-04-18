import { createContext, useContext, useState } from 'react';

const SpotifyContext = createContext();

export function useSpotify() {
  return useContext(SpotifyContext);
}

export function SpotifyProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const toggleLike = (song) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s.id === song.id);
      if (isLiked) {
        return prev.filter(s => s.id !== song.id);
      }
      return [...prev, song];
    });
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const value = {
    likedSongs,
    currentPlaylist,
    isPlaying,
    currentTrack,
    setCurrentPlaylist,
    toggleLike,
    playTrack,
    pauseTrack
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
} 