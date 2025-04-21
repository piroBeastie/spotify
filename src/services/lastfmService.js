import { config } from '../config';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

const getPlaceholderImage = (text, color = '1DB954') => {
  const encodedText = encodeURIComponent(text || 'Unknown');
  return `https://dummyimage.com/300x300/${color}/ffffff&text=${encodedText}`;
};

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
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Error fetching Last.fm API:`, error);
      throw error;
    }
  },

  async getTopArtists(limit = 5) {
    try {
      const response = await this.fetchWebApi('chart.gettopartists', { limit });
      
      if (!response?.artists?.artist) {
        console.error('Invalid response format from Last.fm API');
        return [];
      }

      // Get detailed info for each artist
      const artists = await Promise.all(
        response.artists.artist.map(async (artist) => {
          try {
            const artistAlbums = await this.fetchWebApi('artist.gettopalbums', {
              artist: artist.name,
              limit: 1
            });

            const colors = ['121212', '1DB954', '191414', '282828', '404040'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            return {
              id: artist.mbid || artist.name,
              name: artist.name,
              imageUrl: artistAlbums?.topalbums?.album?.[0]?.image?.[3]?.['#text'] || 
                       `https://via.placeholder.com/300/${randomColor}/FFFFFF?text=${encodeURIComponent(artist.name)}`,
              type: 'artist'
            };
          } catch (error) {
            console.error(`Error fetching albums for artist ${artist.name}:`, error);
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
        console.error('Invalid response format from Last.fm API');
        return [];
      }

      const albumsWithTracks = await Promise.all(
        response.albums.album.map(async (album) => {
          try {
            const albumInfo = await this.fetchWebApi('album.getinfo', {
              artist: album.artist.name,
              album: album.name
            });

            const tracksWithDuration = await Promise.all(
              (albumInfo?.album?.tracks?.track || []).map(async (track) => {
                try {
                  const trackInfo = await this.fetchWebApi('track.getInfo', {
                    artist: album.artist.name,
                    track: track.name
                  });

                  const duration = trackInfo?.track?.duration 
                    ? Math.floor(trackInfo.track.duration / 1000)
                    : 0;

                  return {
                    id: track.mbid || track.name,
                    name: track.name,
                    artists: [{ name: album.artist.name }],
                    duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '--:--'
                  };
                } catch (error) {
                  console.error(`Error fetching duration for track ${track.name}:`, error);
                  return {
                    id: track.mbid || track.name,
                    name: track.name,
                    artists: [{ name: album.artist.name }],
                    duration: '--:--'
                  };
                }
              })
            );

            return {
              id: album.mbid || album.name,
              name: album.name,
              artists: [{ name: album.artist.name }],
              images: album.image ? [
                { url: album.image[3]['#text'] || 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }
              ] : [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }],
              tracks: tracksWithDuration
            };
          } catch (error) {
            console.error(`Error fetching album info for ${album.name}:`, error);
            return {
              id: album.mbid || album.name,
              name: album.name,
              artists: [{ name: album.artist.name }],
              images: album.image ? [
                { url: album.image[3]['#text'] || 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }
              ] : [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }],
              tracks: []
            };
          }
        })
      );

      return albumsWithTracks;
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return [];
    }
  },

  async getFeaturedPlaylists(limit = 5) {
    try {
      const response = await this.fetchWebApi('tag.gettoptags', { limit });
      
      if (!response?.toptags?.tag) {
        console.error('Invalid response format from Last.fm API');
        return [];
      }

      // Get top albums for each tag to use their images
      const playlists = await Promise.all(
        response.toptags.tag.map(async (tag) => {
          try {
            const tagAlbums = await this.fetchWebApi('tag.gettopalbums', { 
              tag: tag.name,
              limit: 1 
            });
            
            const colors = ['121212', '1DB954', '191414', '282828', '404040'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            return {
              id: tag.name,
              name: tag.name,
              description: `Music tagged with ${tag.name}`,
              images: [{ 
                url: tagAlbums?.albums?.album?.[0]?.image?.[3]?.['#text'] || 
                     `https://via.placeholder.com/300/${randomColor}/FFFFFF?text=${encodeURIComponent(tag.name)}` 
              }]
            };
          } catch (error) {
            console.error(`Error fetching albums for tag ${tag.name}:`, error);
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
        console.error('Invalid response format from Last.fm API');
        return [];
      }

      const tracks = response.results.trackmatches.track;

      const tracksWithInfo = await Promise.all(
        tracks.map(async (track) => {
          try {
            const trackInfo = await this.fetchWebApi('track.getInfo', {
              artist: track.artist,
              track: track.name
            });

            const duration = trackInfo?.track?.duration 
              ? Math.floor(trackInfo.track.duration / 1000)
              : 0;

            // Get album info for the track
            const albumResponse = await this.fetchWebApi('album.getinfo', {
              artist: track.artist,
              album: track.album || track.name
            });

            const album = albumResponse?.album;
            let imageUrl = null;

            if (album?.image && Array.isArray(album.image)) {
              const largeImage = album.image.find(img => img.size === 'extralarge') || 
                               album.image.find(img => img.size === 'large');
              
              if (largeImage && largeImage['#text']) {
                imageUrl = largeImage['#text'];
              }
            }

            if (!imageUrl) {
              const artistAlbums = await this.fetchWebApi('artist.gettopalbums', {
                artist: track.artist,
                limit: 1
              });

              if (artistAlbums?.topalbums?.album?.[0]?.image?.[3]?.['#text']) {
                imageUrl = artistAlbums.topalbums.album[0].image[3]['#text'];
              }
            }

            return {
              id: track.mbid || track.name,
              name: track.name,
              artists: [{ name: track.artist }],
              album: {
                name: track.album || track.name,
                images: [{ url: imageUrl || `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(track.name)}` }]
              },
              duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '--:--'
            };
          } catch (error) {
            console.error(`Error fetching info for track ${track.name}:`, error);
            return {
              id: track.mbid || track.name,
              name: track.name,
              artists: [{ name: track.artist }],
              album: {
                name: track.album || track.name,
                images: [{ url: `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(track.name)}` }]
              },
              duration: '--:--'
            };
          }
        })
      );

      return tracksWithInfo;
    } catch (error) {
      console.error('Error searching tracks:', error);
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
        console.error('Invalid response format from Last.fm API');
        return null;
      }

      const artist = response.artist;
      
      // Get artist's top album for a better image
      const topAlbums = await this.fetchWebApi('artist.gettopalbums', {
        artist: artist.name,
        limit: 1
      });

      const colors = ['121212', '1DB954', '191414', '282828', '404040'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: artist.mbid || artist.name,
        name: artist.name,
        image: topAlbums?.topalbums?.album?.[0]?.image?.[3]?.['#text'] || 
               artist.image?.[3]?.['#text'] || 
               `https://via.placeholder.com/300/${randomColor}/FFFFFF?text=${encodeURIComponent(artist.name)}`,
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
        console.error('Invalid response format from Last.fm API');
        return [];
      }

      const tracksWithDuration = await Promise.all(
        response.toptracks.track.map(async (track) => {
          try {
            const trackInfo = await this.fetchWebApi('track.getInfo', {
              artist: track.artist.name,
              track: track.name
            });

            const duration = trackInfo?.track?.duration 
              ? Math.floor(trackInfo.track.duration / 1000)
              : 0;

            return {
              id: track.mbid || track.name,
              name: track.name,
              artist: track.artist.name,
              album: track.album?.title || 'Unknown Album',
              duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '--:--'
            };
          } catch (error) {
            console.error(`Error fetching duration for track ${track.name}:`, error);
            return {
              id: track.mbid || track.name,
              name: track.name,
              artist: track.artist.name,
              album: track.album?.title || 'Unknown Album',
              duration: '--:--'
            };
          }
        })
      );

      return tracksWithDuration;
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      throw error;
    }
  }
}; 