import { useState, useEffect } from 'react';
import TrackCard from '../components/shared/TrackCard';

function Trending() {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            tracks: [
              {
                id: '4',
                title: 'Anti-Hero',
                artist: 'Taylor Swift',
                albumArt: 'https://picsum.photos/300/300?random=20',
              },
              {
                id: '5',
                title: 'As It Was',
                artist: 'Harry Styles',
                albumArt: 'https://picsum.photos/300/300?random=21',
              },
              {
                id: '6',
                title: 'About Damn Time',
                artist: 'Lizzo',
                albumArt: 'https://picsum.photos/300/300?random=22',
              },
            ]
          });
        }, 1000));

        setTrendingTracks(response.tracks);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
      }
    };

    fetchTrendingTracks();
  }, [timeRange]);

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trending</h1>
        <div className="flex space-x-2">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-full transition-colors ${
                timeRange === option.value
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingTracks.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-2">About Trending</h2>
        <p className="text-gray-300">
          Discover what's hot right now in the music world. These tracks are ranked based on 
          plays, likes, and shares across the platform. Switch between different time ranges 
          to see what's been popular recently or over a longer period.
        </p>
      </div>
    </div>
  );
}

export default Trending; 