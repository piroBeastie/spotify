import { useSpotify } from '../../context/SpotifyContext';

function TrackCard({ track }) {
  const { 
    likedSongs, 
    toggleLike
  } = useSpotify();

  const isLiked = likedSongs.some(song => song.id === track.id);

  const getImageUrl = (track) => {
    if (!track.albumArt) {
      return `https://picsum.photos/300/300?random=${track.id}`;
    }
    return track.albumArt;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="relative">
        <img 
          src={getImageUrl(track)} 
          alt={track.title} 
          className="w-full aspect-square object-cover rounded-md mb-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://picsum.photos/300/300?random=${track.id}`;
          }}
        />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold truncate">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(track)}
          className="ml-2 p-1 hover:scale-110 transition-transform"
        >
          <span className={isLiked ? 'text-green-500' : 'text-gray-400'}>
            {isLiked ? '♥' : '♡'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default TrackCard; 