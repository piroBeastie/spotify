import { useState } from 'react';
import TrackCard from '../components/TrackCard';
import { lastfmService } from '../services/lastfmService';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const searchResults = await lastfmService.searchTracks(searchQuery, 5);
      
      // Validate track data
      const validatedTracks = searchResults.map(track => {
        const trackData = {
          id: track.id || track.name,
          name: track.name || 'Unknown Track',
          artists: track.artists || [{ name: 'Unknown Artist' }],
          album: {
            name: track.album?.name || track.name,
            images: track.album?.images || [{ url: null }]
          }
        };
        
        // Check if the image URL is valid
        const imageUrl = trackData.album.images[0].url;
        if (!imageUrl || imageUrl === '') {
          console.log(`Track "${trackData.name}" has no image URL, will use placeholder`);
        } else {
          console.log(`Track "${trackData.name}" image URL:`, imageUrl);
        }
        
        return trackData;
      });
      
      console.log('Final tracks data:', validatedTracks);
      setTracks(validatedTracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setError('Failed to search tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-8">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : tracks.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                id={track.id}
                title={track.name}
                artist={track.artists[0].name}
                coverUrl={track.album.images[0].url}
                type="track"
              />
            ))}
          </div>
        </div>
      ) : searchQuery && !loading && (
        <div className="text-center text-gray-400">
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
} 