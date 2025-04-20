import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackCard({ id, title, artist, coverUrl, type, artistId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'playlist') {
      navigate(`/playlist/${id}`);
    } else if (type === 'artist') {
      navigate(`/artist/${id}`);
    } else if (type === 'album') {
      console.log(`Album clicked: ${id}`);
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square">
        <img
          src={coverUrl || 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9';
          }}
        />
      </div>
      <div className="p-4">
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