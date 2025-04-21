import { useState, useEffect } from 'react';
import TrackCard from '../components/TrackCard';
import { lastfmService } from '../services/lastfmService';

export default function Home() {
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [releases, playlists, artists] = await Promise.all([
          lastfmService.getNewReleases(5),
          lastfmService.getFeaturedPlaylists(5),
          lastfmService.getTopArtists(5)
        ]);
        setNewReleases(releases);
        setFeaturedPlaylists(playlists);
        setTopArtists(artists);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (title, items, type) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.slice(0, 5).map((item) => (
          <TrackCard
            key={item.id}
            id={item.id}
            title={item.name}
            artist={type === 'artist' 
              ? item.genres?.join(', ') || 'Artist'
              : item.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
            coverUrl={type === 'artist' 
              ? (item.imageUrl || (item.images && item.images[0]?.url) || 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9')
              : (item.album?.images && item.album.images[0]?.url) || (item.images && item.images[0]?.url) || 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'}
            type={type}
            artistId={type === 'artist' ? item.id : null}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {renderSection('New Releases', newReleases, 'album')}
      {renderSection('Featured Playlists', featuredPlaylists, 'playlist')}
      {renderSection('Top Artists', topArtists, 'artist')}
    </div>
  );
} 