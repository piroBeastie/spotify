import React, { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyService';
import TrackCard from './TrackCard';
import './Home.css';

const Home = () => {
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
          spotifyService.getNewReleases(),
          spotifyService.getFeaturedPlaylists(),
          spotifyService.getTopArtists()
        ]);
        setNewReleases(releases);
        setFeaturedPlaylists(playlists);
        setTopArtists(artists);
        setError(null);
      } catch (err) {
        setError('Failed to load music data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSection = (items, type) => {
    const title = type === 'album' ? 'New Releases' : 
                 type === 'playlist' ? 'Featured Playlists' : 
                 'Top Artists';

    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
          {items.map((item) => (
            <div key={item.id} className="flex-none w-56">
              <TrackCard
                id={item.id}
                title={item.name}
                artist={type === 'artist' ? item.genres?.join(', ') : 
                       type === 'playlist' ? item.description :
                       item.artists?.map(a => a.name).join(', ')}
                coverUrl={item.images?.[0]?.url}
                type={type}
                artistId={type === 'artist' ? item.id : undefined}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <style>
        {`
          ::-webkit-scrollbar {
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #121212;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: #535353;
            border-radius: 4px;
          }
        `}
      </style>
      {renderSection(newReleases, 'album')}
      {renderSection(featuredPlaylists, 'playlist')}
      {renderSection(topArtists, 'artist')}
    </div>
  );
};

export default Home; 