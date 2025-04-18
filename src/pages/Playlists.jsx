import { useState, useEffect } from 'react';
import { useSpotify } from '../context/SpotifyContext';

function PlaylistCard({ playlist, onSelect }) {
  // Use a more reliable placeholder image service
  const getImageUrl = (playlist) => {
    if (!playlist.coverImage) {
      return `https://picsum.photos/300/300?random=${playlist.id}`;
    }
    return playlist.coverImage;
  };

  return (
    <div 
      onClick={() => onSelect(playlist)}
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="relative aspect-square mb-4">
        <img 
          src={getImageUrl(playlist)} 
          alt={playlist.name}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://picsum.photos/300/300?random=${playlist.id}`;
          }}
        />
      </div>
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.trackCount} tracks</p>
    </div>
  );
}

function Playlists() {
  const { setCurrentPlaylist } = useSpotify();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Simulated API call - replace with actual API integration
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            playlists: [
              {
                id: '1',
                name: 'Summer Hits 2024',
                trackCount: 25,
                coverImage: 'https://picsum.photos/300/300?random=1',
              },
              {
                id: '2',
                name: 'Workout Motivation',
                trackCount: 40,
                coverImage: 'https://picsum.photos/300/300?random=2',
              },
              {
                id: '3',
                name: 'Chill Vibes',
                trackCount: 30,
                coverImage: 'https://picsum.photos/300/300?random=3',
              },
              // Add more playlists as needed
            ]
          });
        }, 1000));

        setPlaylists(response.playlists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = (playlist) => {
    setCurrentPlaylist(playlist);
    // You could navigate to a playlist detail page here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map(playlist => (
          <PlaylistCard 
            key={playlist.id} 
            playlist={playlist} 
            onSelect={handlePlaylistSelect}
          />
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-500">No Playlists</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Playlists Yet</h2>
          <p className="text-gray-400">
            Create your first playlist to start organizing your music.
          </p>
        </div>
      )}
    </div>
  );
}

export default Playlists; 