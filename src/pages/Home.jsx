import { useState, useEffect } from 'react';
import TrackCard from '../components/shared/TrackCard';

function Home() {
  const [featuredTracks, setFeaturedTracks] = useState([]);

  useEffect(() => {
    // Simulated API call - replace with actual API integration
    const fetchFeaturedTracks = async () => {
      try {
        // Simulated data - replace with actual API call
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            tracks: [
              {
                id: '1',
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                albumArt: 'https://picsum.photos/300/300?random=10',
              },
              {
                id: '2',
                title: 'Stay',
                artist: 'Kid LAROI & Justin Bieber',
                albumArt: 'https://picsum.photos/300/300?random=11',
              },
              {
                id: '3',
                title: 'Heat Waves',
                artist: 'Glass Animals',
                albumArt: 'https://picsum.photos/300/300?random=12',
              },
              // Add more tracks as needed
            ]
          });
        }, 1000));

        setFeaturedTracks(response.tracks);
      } catch (error) {
        console.error('Error fetching featured tracks:', error);
      }
    };

    fetchFeaturedTracks();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredTracks.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Welcome to SpotifyIMDB</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-300">
            Discover trending playlists, explore new music, and keep track of your favorite songs.
            Use the navigation above to browse different sections of the app.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home; 