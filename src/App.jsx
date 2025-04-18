import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Trending from './pages/Trending';
import Playlists from './pages/Playlists';
import LikedSongs from './pages/LikedSongs';
import { SpotifyProvider } from './context/SpotifyContext';

function App() {
  return (
    <SpotifyProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/liked" element={<LikedSongs />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SpotifyProvider>
  );
}

export default App;
