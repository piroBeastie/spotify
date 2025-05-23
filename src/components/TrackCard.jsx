import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackCard({ id, title, artist, coverUrl, type, artistId, album }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (type === 'playlist') {
      navigate(`/playlist/${id}`);
    } else if (type === 'artist') {
      navigate(`/artist/${artistId || id}`);
    } else if (type === 'album') {
      navigate(`/album/${encodeURIComponent(artist)}/${encodeURIComponent(id)}`);
    } else if (type === 'track' && album?.name) {
      navigate(`/album/${encodeURIComponent(artist)}/${encodeURIComponent(album.name)}`);
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square">
        {imageError || !coverUrl ? (
          <div 
            className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-300 font-bold text-center"
            style={{ 
              aspectRatio: '1/1',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }}
          >
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-xl mb-1">🎵</span>
              <span className="text-xs px-1">{title || 'Unknown Track'}</span>
            </div>
          </div>
        ) : (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {title}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {artist}
        </p>
      </div>
    </div>
  );
} 