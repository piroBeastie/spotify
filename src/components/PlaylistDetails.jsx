import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lastfmService } from '../services/lastfmService';
import './PlaylistDetails.css';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Since Last.fm doesn't have playlists, we'll use tags as categories
        // and get tracks for that tag
        const tagInfo = await lastfmService.fetchWebApi('tag.getinfo', { tag: playlistId });
        
        if (!tagInfo?.tag) {
          throw new Error('Playlist not found');
        }
        
        const tag = tagInfo.tag;
        
        // Get top albums for this tag to use as cover image
        const tagAlbums = await lastfmService.fetchWebApi('tag.gettopalbums', { 
          tag: tag.name,
          limit: 1 
        });

        const coverImage = tagAlbums?.albums?.album?.[0]?.image?.[3]?.['#text'] || 
                          `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(tag.name)}`;
        
        setPlaylist({
          id: tag.name,
          name: tag.name,
          description: tag.wiki?.content || `Music tagged with ${tag.name}`,
          images: [{ url: coverImage }],
          owner: 'Last.fm'
        });
        
        // Get top tracks for this tag
        const tracksResponse = await lastfmService.fetchWebApi('tag.gettoptracks', { tag: playlistId });
        
        if (tracksResponse?.tracks?.track) {
          // Get detailed track info for each track to get duration
          const tracksWithDuration = await Promise.all(
            tracksResponse.tracks.track.map(async (track) => {
              try {
                // Get track info to get duration
                const trackInfo = await lastfmService.fetchWebApi('track.getInfo', {
                  artist: track.artist.name,
                  track: track.name
                });

                const duration = trackInfo?.track?.duration 
                  ? Math.floor(trackInfo.track.duration / 1000) // Convert to seconds
                  : 0;

                return {
                  id: track.mbid || track.name,
                  name: track.name,
                  artists: [{ name: track.artist.name }],
                  album: {
                    name: track.album?.title || 'Unknown Album',
                    images: [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }]
                  },
                  duration: duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '--:--'
                };
              } catch (error) {
                console.error(`Error fetching duration for track ${track.name}:`, error);
                return {
                  id: track.mbid || track.name,
                  name: track.name,
                  artists: [{ name: track.artist.name }],
                  album: {
                    name: track.album?.title || 'Unknown Album',
                    images: [{ url: 'https://via.placeholder.com/300/121212/FFFFFF?text=Album' }]
                  },
                  duration: '--:--'
                };
              }
            })
          );

          setTracks(tracksWithDuration);
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

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = (text) => {
    const maxLength = 200;
    if (!text) return null;
    
    if (text.length <= maxLength) {
      return <p className="playlist-description">{text}</p>;
    }

    const truncatedText = showFullDescription ? text : `${text.slice(0, maxLength)}...`;
    
    return (
      <div className="playlist-description-container">
        <p className="playlist-description">
          {truncatedText}
          <button 
            className="read-more-button"
            onClick={toggleDescription}
          >
            {showFullDescription ? 'Show Less' : 'Read More'}
          </button>
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="playlist-details-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playlist-details-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-details-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="error">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="playlist-details-container">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>

      <div className="playlist-header">
        <div className="playlist-image">
          <img 
            src={playlist.images[0].url} 
            alt={playlist.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300/121212/FFFFFF?text=${encodeURIComponent(playlist.name)}`;
            }}
          />
        </div>
        <div className="playlist-info">
          <h1 className="playlist-name">{playlist.name}</h1>
          <p className="playlist-owner">By {playlist.owner}</p>
          {renderDescription(playlist.description)}
        </div>
      </div>

      <div className="tracks-section">
        <h2>Tracks</h2>
        {tracks.length > 0 ? (
          <div className="tracks-list">
            {tracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-artist">{track.artists[0].name}</div>
                </div>
                <div className="track-album">{track.album.name}</div>
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

export default PlaylistDetails; 