import { useState } from 'react';
import TrackCard from '../components/TrackCard';
import { spotifyService } from '../services/spotifyService';

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
      const searchResults = await spotifyService.searchTracks(searchQuery);
      setTracks(searchResults);
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
                artist={track.artists.map(artist => artist.name).join(', ')}
                coverUrl={track.album.images[0]?.url}
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