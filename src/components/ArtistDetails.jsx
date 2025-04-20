import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotifyService';
import './ArtistDetails.css';

const ArtistDetails = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await spotifyService.fetchWebApi(`artists/${artistId}`);
        
        if (!response || !response.id) {
          throw new Error('Artist not found');
        }
        
        setArtist({
          id: response.id,
          name: response.name,
          imageUrl: response.images?.[0]?.url || 'https://via.placeholder.com/300/121212/FFFFFF?text=Artist',
          type: 'artist',
          genres: response.genres || [],
          popularity: response.popularity || 0,
          followers: response.followers?.total || 0
        });
        
        // Get artist top tracks
        const tracksResponse = await spotifyService.fetchWebApi(`artists/${artistId}/top-tracks?market=US`);
        
        if (tracksResponse && tracksResponse.tracks) {
          setTracks(tracksResponse.tracks.map(track => ({
            id: track.id,
            name: track.name,
            duration_ms: track.duration_ms,
            album: {
              id: track.album.id,
              name: track.album.name,
              imageUrl: track.album.images?.[0]?.url || 'https://via.placeholder.com/300/121212/FFFFFF?text=Album'
            },
            artists: track.artists.map(artist => ({
              id: artist.id,
              name: artist.name
            }))
          })));
        }
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError('Failed to load artist details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="artist-details-container">
        <div className="loading">Loading artist details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artist-details-container">
        <div className="error">{error}</div>
        <button className="back-button" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-details-container">
        <div className="error">Artist not found</div>
        <button className="back-button" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="artist-details-container">
      <button className="back-button" onClick={handleBack}>← Back</button>
      
      <div className="artist-header">
        <div className="artist-image">
          <img 
            src={artist.imageUrl} 
            alt={artist.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300/121212/FFFFFF?text=Artist';
            }}
          />
        </div>
        <div className="artist-info">
          <h1>{artist.name}</h1>
          <p className="artist-type">Artist</p>
          {artist.genres && artist.genres.length > 0 && (
            <p className="artist-genres">{artist.genres.join(', ')}</p>
          )}
          <p className="artist-followers">{artist.followers.toLocaleString()} followers</p>
        </div>
      </div>
      
      <div className="tracks-section">
        <h2>Popular Tracks</h2>
        {tracks.length > 0 ? (
          <ul className="tracks-list">
            {tracks.map((track, index) => (
              <li key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-duration">
                    {Math.floor(track.duration_ms / 60000)}:{(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks found</p>
        )}
      </div>
    </div>
  );
};

export default ArtistDetails; 