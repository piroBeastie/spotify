import { useSpotify } from '../context/SpotifyContext';
import TrackCard from '../components/shared/TrackCard';

function LikedSongs() {
  const { likedSongs } = useSpotify();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-pink-600 to-rose-500 p-4 rounded-lg">
          <span className="text-white text-xl">♥</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Liked Songs</h1>
          <p className="text-gray-400">{likedSongs.length} tracks</p>
        </div>
      </div>

      {likedSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedSongs.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-500">♥</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Liked Songs Yet</h2>
          <p className="text-gray-400">
            Start liking songs to build your collection. Click the heart icon on any track to add it here.
          </p>
        </div>
      )}

      {likedSongs.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-2">About Your Liked Songs</h2>
          <p className="text-gray-300">
            This is your collection of favorite tracks. You can like or unlike songs at any time,
            and they'll be automatically updated here. Use this as your personal music library!
          </p>
        </div>
      )}
    </div>
  );
}

export default LikedSongs; 