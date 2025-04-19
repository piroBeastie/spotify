import React from 'react';

export default function TrackCard({ id, title, artist, coverUrl }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200">
      <div className="aspect-square">
        <img
          src={coverUrl || 'https://placehold.co/300x300/1DB954/FFFFFF?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300/1DB954/FFFFFF?text=No+Image';
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