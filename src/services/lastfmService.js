import { config } from '../config';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export const lastfmService = {
  async fetchWebApi(method, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        method,
        api_key: config.LASTFM_API_KEY,
        format: 'json',
        ...params
      });

      const res = await fetch(`${LASTFM_API_BASE}?${queryParams.toString()}`);

      if (!res.ok) {
        if (res.status === 404) {
          return { error: 'not_found' };
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        console.warn(`Last.fm API error: ${data.message}`);
        return { error: data.error, message: data.message };
      }

      return data;
    } catch (error) {
      console.error(`Error fetching Last.fm API:`, error);
      return { error: 'network_error', message: error.message };
    }
  },

  async getTopArtists(limit = 5) {
    try {
      const response = await this.fetchWebApi('chart.gettopartists', { limit });
      
      if (!response?.artists?.artist) {
        return [];
      }

      const artists = await Promise.all(
        response.artists.artist.map(async (artist) => {
          try {
            const artistAlbums = await this.fetchWebApi('artist.gettopalbums', {
              artist: artist.name,
              limit: 1
            });

            return {
              id: artist.mbid || artist.name,
              name: artist.name,
              imageUrl: artistAlbums?.topalbums?.album?.[0]?.image?.[3]?.['#text'] || 
                       `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(artist.name)}`,
              type: 'artist'
            };
          } catch (error) {
            console.warn(`Error fetching albums for artist ${artist.name}:`, error);
            return {
              id: artist.mbid || artist.name,
              name: artist.name,
              imageUrl: `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(artist.name)}`,
              type: 'artist'
            };
          }
        })
      );

      return artists;
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return [];
    }
  },

  async getNewReleases(limit = 5) {
    try {
      const response = await this.fetchWebApi('tag.gettopalbums', { 
        tag: 'new',
        limit 
      });
      
      if (!response?.albums?.album) {
        return [];
      }

      return response.albums.album.map(album => ({
        id: album.mbid || album.name,
        name: album.name,
        artists: [{ name: album.artist.name }],
        images: album.image ? [
          { url: album.image[3]['#text'] || 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }
        ] : [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }],
        tracks: []
      }));
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return [];
    }
  },

  async getFeaturedPlaylists(limit = 5) {
    try {
      const response = await this.fetchWebApi('tag.gettoptags', { limit });
      
      if (!response?.toptags?.tag) {
        return [];
      }

      const playlists = await Promise.all(
        response.toptags.tag.map(async (tag) => {
          try {
            const tagAlbums = await this.fetchWebApi('tag.gettopalbums', { 
              tag: tag.name,
              limit: 1 
            });
            
            return {
              id: tag.name,
              name: tag.name,
              description: `Music tagged with ${tag.name}`,
              images: [{ 
                url: tagAlbums?.albums?.album?.[0]?.image?.[3]?.['#text'] || 
                     `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(tag.name)}` 
              }]
            };
          } catch (error) {
            console.warn(`Error fetching albums for tag ${tag.name}:`, error);
            return {
              id: tag.name,
              name: tag.name,
              description: `Music tagged with ${tag.name}`,
              images: [{ 
                url: `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(tag.name)}` 
              }]
            };
          }
        })
      );

      return playlists;
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      return [];
    }
  },

  async searchTracks(query, limit = 5) {
    try {
      const response = await this.fetchWebApi('track.search', { 
        track: query,
        limit 
      });
      
      if (!response?.results?.trackmatches?.track) {
        return [];
      }

      const tracks = response.results.trackmatches.track;
      const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
      
      return tracksArray.map(track => ({
        id: track.mbid || track.name,
        name: track.name,
        artists: [{ name: track.artist }],
        album: {
          name: track.name,
          images: [{ url: track.image?.[3]?.['#text'] || null }]
        }
      }));
    } catch (error) {
      console.error('Error in searchTracks:', error);
      return [];
    }
  },

  async getArtistDetails(artistId) {
    try {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }

      const response = await this.fetchWebApi('artist.getinfo', { 
        mbid: artistId?.includes('-') ? artistId : undefined,
        artist: artistId?.includes('-') ? undefined : artistId
      });
      
      if (!response?.artist) {
        return null;
      }

      const artist = response.artist;
      
      // Get artist's top album for a better image
      const topAlbums = await this.fetchWebApi('artist.gettopalbums', {
        artist: artist.name,
        limit: 1
      });
      
      return {
        id: artist.mbid || artist.name,
        name: artist.name,
        image: topAlbums?.topalbums?.album?.[0]?.image?.[3]?.['#text'] || 
               artist.image?.[3]?.['#text'] || 
               `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(artist.name)}`,
        bio: artist.bio?.summary || '',
        genres: artist.tags?.tag?.map(tag => tag.name) || []
      };
    } catch (error) {
      console.error('Error fetching artist details:', error);
      throw error;
    }
  },

  async getArtistTopTracks(artistId) {
    try {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }

      const response = await this.fetchWebApi('artist.gettoptracks', { 
        mbid: artistId?.includes('-') ? artistId : undefined,
        artist: artistId?.includes('-') ? undefined : artistId,
        limit: 5
      });
      
      if (!response?.toptracks?.track) {
        return [];
      }

      return response.toptracks.track.map(track => ({
        id: track.mbid || track.name,
        name: track.name,
        artist: track.artist.name,
        album: track.album?.title || 'Unknown Album',
        duration: '--:--'
      }));
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      throw error;
    }
  }
}; 