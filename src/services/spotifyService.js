import { config } from '../config';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const FALLBACK_IMAGES = {
  album: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album',
  artist: 'https://via.placeholder.com/300/121212/FFFFFF?text=Artist',
  playlist: 'https://via.placeholder.com/300/121212/FFFFFF?text=Playlist',
  track: 'https://via.placeholder.com/300/121212/FFFFFF?text=Track'
};

export const spotifyService = {
  async fetchWebApi(endpoint, method = 'GET', body = null) {
    try {
      const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${config.SPOTIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method,
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please check your Spotify API key.');
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  async getNewReleases(limit = 20) {
    try {
      const response = await this.fetchWebApi(`browse/new-releases?country=US&limit=${limit}`);
      return response.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artists: album.artists,
        images: album.images && album.images.length > 0 
          ? album.images 
          : [{ url: FALLBACK_IMAGES.album }]
      }));
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return [];
    }
  },

  async getFeaturedPlaylists(limit = 20) {
    try {
      const response = await this.fetchWebApi(
        `search?q=playlist:2024&type=playlist&limit=${limit}`
      );

      if (!response || !response.playlists || !response.playlists.items) {
        console.error('Invalid response format from search API');
        return [];
      }

      return response.playlists.items
        .filter(playlist => playlist && playlist.id && playlist.name)
        .map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description || `A curated playlist by ${playlist.owner?.display_name || 'Spotify'}`,
          images: playlist.images && playlist.images.length > 0 
            ? playlist.images 
            : [{ url: FALLBACK_IMAGES.playlist }]
        }));
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      return [];
    }
  },

  async getTopArtists() {
    try {
      const response = await this.fetchWebApi(
        'search?q=year:2024&type=artist&limit=20'
      );
      
      if (!response?.artists?.items) {
        console.error('Invalid response format from search:', response);
        return [];
      }

      return response.artists.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url || FALLBACK_IMAGES.artist,
        type: 'artist'
      }));
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return [];
    }
  },

  async getCategories() {
    try {
      const response = await this.fetchWebApi('browse/categories?limit=20');
      
      if (!response?.categories?.items) {
        console.error('Invalid response format for categories:', response);
        return [];
      }
      
      return response.categories.items.map(category => ({
        id: category.id,
        name: category.name,
        imageUrl: category.icons?.[0]?.url || FALLBACK_IMAGES.playlist,
        type: 'category'
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getPlaylistDetails(playlistId) {
    try {
      const response = await this.fetchWebApi(`playlists/${playlistId}`);
      
      if (!response || !response.id) {
        console.error('Invalid response format for playlist details:', response);
        return null;
      }
      
      return {
        id: response.id,
        name: response.name,
        description: response.description || 'A curated playlist',
        imageUrl: response.images?.[0]?.url || FALLBACK_IMAGES.playlist,
        tracks: response.tracks?.items?.map(item => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          duration: item.track.duration_ms,
          imageUrl: item.track.album.images?.[0]?.url || FALLBACK_IMAGES.track
        })) || []
      };
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      return null;
    }
  }
}; 