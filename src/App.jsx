import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import AlbumDetails from './components/AlbumDetails';
import ArtistDetails from './components/ArtistDetails';
import PlaylistDetails from './components/PlaylistDetails';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black text-white">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/album/:artistName/:albumId" element={<AlbumDetails />} />
              <Route path="/artist/:artistId" element={<ArtistDetails />} />
              <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
