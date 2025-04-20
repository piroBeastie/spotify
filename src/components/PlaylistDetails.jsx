import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotifyService';
import './PlaylistDetails.css';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await spotifyService.fetchWebApi(`playlists/${playlistId}`);
        
        if (!response || !response.id) {
          throw new Error('Playlist not found');
        }
        
        setPlaylist({
          id: response.id,
          name: response.name,
          description: response.description || 'A curated playlist',
          images: response.images || [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Playlist' }],
          owner: response.owner?.display_name || 'Spotify'
        });
        
        if (response.tracks && response.tracks.items) {
          setTracks(response.tracks.items.map(item => ({
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map(artist => artist.name).join(', '),
            duration: item.track.duration_ms,
            album: {
              name: item.track.album.name,
              images: item.track.album.images || [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }]
            }
          })));
        }
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError('Failed to load playlist details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistDetails();
    }
  }, [playlistId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="playlist-details-container">
        <div className="loading">Loading playlist details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playlist-details-container">
        <div className="error">{error}</div>
        <button className="back-button" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-details-container">
        <div className="error">Playlist not found</div>
        <button className="back-button" onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="playlist-details-container">
      <button className="back-button" onClick={handleBack}>← Back</button>
      
      <div className="playlist-header">
        <div className="playlist-image">
          <img 
            src={playlist.images[0].url} 
            alt={playlist.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300/121212/FFFFFF?text=Playlist';
            }}
          />
        </div>
        <div className="playlist-info">
          <h1>{playlist.name}</h1>
          <p className="playlist-description">{playlist.description}</p>
          <p className="playlist-owner">By {playlist.owner}</p>
        </div>
      </div>
      
      <div className="tracks-section">
        <h2>Tracks</h2>
        {tracks.length > 0 ? (
          <ul className="tracks-list">
            {tracks.map((track, index) => (
              <li key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-artist">{track.artists}</div>
                  <div className="track-duration">
                    {Math.floor(track.duration / 60000)}:{(track.duration % 60000 / 1000).toFixed(0).padStart(2, '0')}
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

export default PlaylistDetails; 