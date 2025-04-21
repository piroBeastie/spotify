import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lastfmService } from '../services/lastfmService';
import './AlbumDetails.css';

const AlbumDetails = () => {
  const { albumId, artistName } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get album info
        const albumInfo = await lastfmService.fetchWebApi('album.getinfo', {
          artist: decodeURIComponent(artistName),
          album: decodeURIComponent(albumId)
        });

        if (!albumInfo?.album) {
          throw new Error('Album not found');
        }

        const albumData = albumInfo.album;
        setAlbum({
          id: albumData.mbid || albumData.name,
          name: albumData.name,
          artist: albumData.artist,
          image: albumData.image?.[3]?.['#text'] || 
                 `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(albumData.name)}`,
          releaseDate: albumData.releasedate || 'Unknown'
        });

        // Get tracks
        const tracksData = albumData.tracks?.track || [];
        const tracksArray = Array.isArray(tracksData) ? tracksData : [tracksData];

        if (tracksArray.length > 0) {
          const tracksWithDuration = await Promise.all(
            tracksArray.map(async (track) => {
              try {
                const trackInfo = await lastfmService.fetchWebApi('track.getInfo', {
                  artist: decodeURIComponent(artistName),
                  track: track.name
                });

                const duration = trackInfo?.track?.duration 
                  ? Math.floor(trackInfo.track.duration / 1000)
                  : 0;

                return {
                  id: track.mbid || track.name,
                  name: track.name,
                  duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '--:--'
                };
              } catch (error) {
                console.warn(`Error fetching duration for track ${track.name}:`, error);
                return {
                  id: track.mbid || track.name,
                  name: track.name,
                  duration: '--:--'
                };
              }
            })
          );
          setTracks(tracksWithDuration);
        }
      } catch (err) {
        console.error('Error fetching album details:', err);
        setError(err.message || 'Failed to load album details');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId, artistName]);

  if (loading) {
    return (
      <div className="album-details-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="album-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="error">{error || 'Album not found'}</div>
      </div>
    );
  }

  return (
    <div className="album-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="album-header">
        <div className="album-image">
          <img src={album.image} alt={album.name} />
        </div>
        <div className="album-info">
          <h1>{album.name}</h1>
          <h2>{album.artist}</h2>
          <p className="release-date">Released: {album.releaseDate}</p>
        </div>
      </div>

      <div className="tracks-list">
        <h3>Tracks</h3>
        <div className="tracks">
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                <span className="track-name">{track.name}</span>
                <span className="track-duration">{track.duration}</span>
              </div>
            ))
          ) : (
            <div className="no-tracks">No tracks available for this album</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails; 