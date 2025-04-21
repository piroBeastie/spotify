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
      
      const validatedTracks = searchResults.map(track => ({
        id: track.id || track.name,
        name: track.name,
        artists: track.artists || [{ name: 'Unknown Artist' }],
        album: {
          name: track.album?.name || track.name,
          images: track.album?.images || [{ url: null }]
        }
      }));
      
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
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tracks..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-center mb-8">
          {error}
        </div>
      )}

      {tracks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              id={track.id}
              title={track.name}
              artist={track.artists[0].name}
              coverUrl={track.album.images[0].url}
              type="track"
              album={track.album}
            />
          ))}
        </div>
      )}

      {!loading && tracks.length === 0 && searchQuery && (
        <div className="text-center text-gray-400">
          No tracks found. Try a different search term.
        </div>
      )}
    </div>
  );
} 