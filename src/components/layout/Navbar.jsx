import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              SpotifyIMDB
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/search" className="text-gray-300 hover:text-white">
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 