import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-black p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Spotify Clone</h1>
      </div>
      
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <span className="mr-4">🏠</span>
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <span className="mr-4">🔍</span>
              Search
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 