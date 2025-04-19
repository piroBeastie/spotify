import axios from 'axios';
import { SPOTIFY_CONFIG } from './spotifyService';

const API_BASE_URL = SPOTIFY_CONFIG.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SPOTIFY_CONFIG.SPOTIFY_API_KEY}`
  },
});

// Default API configuration
const API_CONFIG = {
  country: 'US',
  limit: 20
};

export const getFeaturedTracks = async () => {
  try {
    const response = await api.get(`/browse/featured-playlists?country=${API_CONFIG.country}&limit=${API_CONFIG.limit}`);
    return response.data.playlists.items.map(playlist => ({
      id: playlist.id,
      title: playlist.name,
      artist: playlist.owner.display_name,
      albumArt: playlist.images[0]?.url || `https://picsum.photos/300/300?random=${playlist.id}`,
    }));
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
    return [];
  }
};

export const getTrendingTracks = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/browse/new-releases?country=${API_CONFIG.country}&limit=${API_CONFIG.limit}`);
    return response.data.albums.items.map(album => ({
      id: album.id,
      title: album.name,
      artist: album.artists[0].name,
      albumArt: album.images[0]?.url || `https://picsum.photos/300/300?random=${album.id}`,
    }));
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return [];
  }
};

export const getPlaylists = async () => {
  try {
    const response = await api.get(`/browse/categories/toplists/playlists?country=${API_CONFIG.country}&limit=${API_CONFIG.limit}`);
    return response.data.playlists.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist.tracks?.total || 0,
      coverImage: playlist.images[0]?.url || `https://picsum.photos/300/300?random=${playlist.id}`,
    }));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

export const getLikedSongs = async () => {
  try {
    const response = await api.get('/me/tracks');
    return response.data.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      albumArt: item.track.album.images[0]?.url || `https://picsum.photos/300/300?random=${item.track.id}`,
    }));
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    return [];
  }
};

export const toggleLikeTrack = async (trackId, isLiked) => {
  try {
    if (isLiked) {
      await api.delete(`/me/tracks?ids=${trackId}`);
    } else {
      await api.put(`/me/tracks?ids=${trackId}`);
    }
    return true;
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
};

export default api; 