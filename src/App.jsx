import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import ArtistDetails from './components/ArtistDetails';
import PlaylistDetails from './components/PlaylistDetails';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artist/:artistId" element={<ArtistDetails />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
