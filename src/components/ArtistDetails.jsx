import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lastfmService } from '../services/lastfmService';
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
      if (!artistId) {
        setError('Artist ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [artistData, tracksData] = await Promise.all([
          lastfmService.getArtistDetails(artistId),
          lastfmService.getArtistTopTracks(artistId)
        ]);

        if (!artistData) {
          throw new Error('Artist not found');
        }

        if (artistData.bio) {
          artistData.bio = artistData.bio
            .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1') 
            .replace(/<[^>]+>/g, '')
            .trim();
        }

        setArtist(artistData);
        setTracks(tracksData);
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError(err.message || 'Failed to load artist details');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="artist-details-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artist-details-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-details-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="error">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="artist-details-container">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>

      <div className="artist-header">
        <div className="artist-image">
          <img src={artist.image} alt={artist.name} onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/300x300/1db954/ffffff?text=${encodeURIComponent(artist.name)}`;
          }} />
        </div>
        <div className="artist-info">
          <h1>{artist.name}</h1>
          {artist.genres && artist.genres.length > 0 && (
            <div className="artist-genres">
              {artist.genres.map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
          {artist.bio && (
            <div className="artist-bio">
              <h3>About</h3>
              <p>{artist.bio}</p>
            </div>
          )}
        </div>
      </div>

      <div className="tracks-section">
        <h2>Top Tracks</h2>
        {tracks.length > 0 ? (
          <div className="tracks-list">
            {tracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-artist">{track.artists?.[0]?.name || artist.name}</div>
                </div>
                <div className="track-album">{track.album?.name || 'Unknown Album'}</div>
                <div className="track-duration">{track.duration}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tracks">No tracks found</div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetails; 