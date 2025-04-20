import React, { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyService';
import './Home.css';

const Home = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [releases, playlists, artists, cats] = await Promise.all([
          spotifyService.getNewReleases(),
          spotifyService.getFeaturedPlaylists(),
          spotifyService.getTopArtists(),
          spotifyService.getCategories()
        ]);

        console.log('Categories data:', cats);

        setNewReleases(releases);
        setFeaturedPlaylists(playlists);
        setTopArtists(artists);
        setCategories(cats);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSection = (items, type) => {
    if (!items || items.length === 0) {
      console.log(`No items for section ${type}`);
      return null;
    }

    console.log(`Rendering section ${type} with ${items.length} items`);

    const getTitle = () => {
      switch (type) {
        case 'new-releases':
          return 'New Releases';
        case 'featured-playlists':
          return 'Featured Playlists';
        case 'top-artists':
          return 'Top Artists';
        case 'categories':
          return 'Browse by Category';
        default:
          return '';
      }
    };

    return (
      <div className="section">
        <h2>{getTitle()}</h2>
        <div className="items-grid">
          {items.map((item) => {
            console.log(`Rendering item in ${type}:`, item);
            return (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <img
                    src={item.images?.[0]?.url || '/default-image.png'}
                    alt={item.name}
                  />
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  {type === 'top-artists' && item.genres && (
                    <p>{item.genres.slice(0, 2).join(', ')}</p>
                  )}
                  {type === 'featured-playlists' && (
                    <p>{item.description}</p>
                  )}
                  {type === 'categories' && (
                    <p>{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      {renderSection(newReleases, 'new-releases')}
      {renderSection(featuredPlaylists, 'featured-playlists')}
      {renderSection(categories, 'categories')}
      {renderSection(topArtists, 'top-artists')}
    </div>
  );
};

export default Home; 