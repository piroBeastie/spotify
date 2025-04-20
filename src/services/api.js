import axios from 'axios';
import { SPOTIFY_API_KEY, API_CONFIG } from '../config';

const API_BASE_URL = 'https://api.spotify.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SPOTIFY_API_KEY}`
  },
});

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
    return getMockFeaturedTracks();
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
    return getMockTrendingTracks();
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
    return getMockPlaylists();
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

// Mock data for when API calls fail
export const getMockFeaturedTracks = () => {
  return [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      albumArt: 'https://picsum.photos/300/300?random=10',
    },
    {
      id: '2',
      title: 'Stay',
      artist: 'Kid LAROI & Justin Bieber',
      albumArt: 'https://picsum.photos/300/300?random=11',
    },
    {
      id: '3',
      title: 'Heat Waves',
      artist: 'Glass Animals',
      albumArt: 'https://picsum.photos/300/300?random=12',
    },
    {
      id: '4',
      title: 'Anti-Hero',
      artist: 'Taylor Swift',
      albumArt: 'https://picsum.photos/300/300?random=13',
    },
    {
      id: '5',
      title: 'As It Was',
      artist: 'Harry Styles',
      albumArt: 'https://picsum.photos/300/300?random=14',
    },
    {
      id: '6',
      title: 'About Damn Time',
      artist: 'Lizzo',
      albumArt: 'https://picsum.photos/300/300?random=15',
    },
    {
      id: '7',
      title: 'Break My Soul',
      artist: 'Beyoncé',
      albumArt: 'https://picsum.photos/300/300?random=16',
    },
    {
      id: '8',
      title: 'First Class',
      artist: 'Jack Harlow',
      albumArt: 'https://picsum.photos/300/300?random=17',
    },
  ];
};

export const getMockTrendingTracks = () => {
  return [
    {
      id: '9',
      title: 'Unholy',
      artist: 'Sam Smith & Kim Petras',
      albumArt: 'https://picsum.photos/300/300?random=20',
    },
    {
      id: '10',
      title: 'Rich Flex',
      artist: 'Drake & 21 Savage',
      albumArt: 'https://picsum.photos/300/300?random=21',
    },
    {
      id: '11',
      title: 'Super Freaky Girl',
      artist: 'Nicki Minaj',
      albumArt: 'https://picsum.photos/300/300?random=22',
    },
    {
      id: '12',
      title: 'Vegas',
      artist: 'Doja Cat',
      albumArt: 'https://picsum.photos/300/300?random=23',
    },
    {
      id: '13',
      title: 'Hold Me Closer',
      artist: 'Elton John & Britney Spears',
      albumArt: 'https://picsum.photos/300/300?random=24',
    },
    {
      id: '14',
      title: 'Bad Habit',
      artist: 'Steve Lacy',
      albumArt: 'https://picsum.photos/300/300?random=25',
    },
    {
      id: '15',
      title: 'I Ain\'t Worried',
      artist: 'OneRepublic',
      albumArt: 'https://picsum.photos/300/300?random=26',
    },
    {
      id: '16',
      title: 'Break My Soul',
      artist: 'Beyoncé',
      albumArt: 'https://picsum.photos/300/300?random=27',
    },
  ];
};

export const getMockPlaylists = () => {
  return [
    {
      id: '1',
      name: 'Summer Hits 2024',
      trackCount: 25,
      coverImage: 'https://picsum.photos/300/300?random=1',
    },
    {
      id: '2',
      name: 'Workout Motivation',
      trackCount: 40,
      coverImage: 'https://picsum.photos/300/300?random=2',
    },
    {
      id: '3',
      name: 'Chill Vibes',
      trackCount: 30,
      coverImage: 'https://picsum.photos/300/300?random=3',
    },
    {
      id: '4',
      name: 'Top 50 Global',
      trackCount: 50,
      coverImage: 'https://picsum.photos/300/300?random=4',
    },
    {
      id: '5',
      name: 'Indie Discoveries',
      trackCount: 35,
      coverImage: 'https://picsum.photos/300/300?random=5',
    },
    {
      id: '6',
      name: 'Hip Hop Classics',
      trackCount: 45,
      coverImage: 'https://picsum.photos/300/300?random=6',
    },
  ];
};

export default api; 