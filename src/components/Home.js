import React, { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyService';
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const renderSection = (title, items, type) => (
    <div className="section">
      <h2>{title}</h2>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.images[0]?.url} alt={item.name} className="item-image" />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{type === 'artist' ? item.genres?.join(', ') : item.artists?.map(a => a.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {renderSection('New Releases', newReleases, 'album')}
          {renderSection('Featured Playlists', featuredPlaylists, 'playlist')}
          {renderSection('Top Artists', topArtists, 'artist')}
        </>
      )}
    </div>
  );
};

export default Home; 