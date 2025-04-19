// Spotify API configuration
export const SPOTIFY_CONFIG = {
  SPOTIFY_API_KEY: 'BQD8szn08KGtci0apSCy8wW9SmlQA1ZmKFUPPQ83uTVpbi5ho3S62c-3G48N8wCgTGx8GM9khkf6XngZ_U8I4FSF9FZF5vKONCYHDKPMKBXyUFJ1VpY1iL3qCqO-rNkfkeacE2_s5kgo2p6OVgdZdgSjNdEM2OicXyle5_pIiUjKbWFIJB5Dln8BuZ2cUfpo-oRVLzylct3le8_rtAS6cLGVSSvvXjSyszMITS1bxhW2JRS4Vgx-UpevGPK_F85oykdSXUtg9b_JHWjtGTi_Zx8J8gj9ZtJKcHKOs1CS4qov93bZRMeRkiu_Zcsb',
  API_BASE_URL: 'https://api.spotify.com/v1',
  SPOTIFY_CLIENT_ID: 'your_client_id_here',
  SPOTIFY_CLIENT_SECRET: 'your_client_secret_here',
  REDIRECT_URI: 'http://localhost:5173/callback'
};

const SPOTIFY_API_BASE = SPOTIFY_CONFIG.API_BASE_URL;

export const spotifyService = {
  async fetchWebApi(endpoint, method = 'GET', body = null) {
    try {
      const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${SPOTIFY_CONFIG.SPOTIFY_API_KEY}`,
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
        images: album.images
      }));
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return [];
    }
  },

  async getFeaturedPlaylists(limit = 20) {
    try {
      const response = await this.fetchWebApi(`search?q=playlist&type=playlist&limit=${limit}`);
      if (response && response.playlists && response.playlists.items) {
        return response.playlists.items.filter(item => item !== null && item !== undefined);
      }
      throw new Error('Invalid response structure from Spotify API');
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      return [];
    }
  },

  async getTopArtists(limit = 20) {
    try {
      const response = await this.fetchWebApi(`artists?ids=0TnOYISbd1XYRBk9myaseg,3HqSLMAZ3g3d5poNaI7GOU,06HL4z0CvFAxyc27GXpf02,1uNFoZAHBGtllmzznpCI3s,6eUKZXaKkcviH0Ku9w2n3V&market=US`);
      return response.artists.slice(0, limit);
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return [];
    }
  },

  async getArtistTopTracks(artistId, limit = 10) {
    try {
      const response = await this.fetchWebApi(`artists/${artistId}/top-tracks?market=US`);
      return response.tracks.slice(0, limit);
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      return [];
    }
  },

  async searchTracks(query, limit = 20) {
    try {
      const response = await this.fetchWebApi(`search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
      return response.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }
}; 