# SpotifyIMDB

A modern web application that combines the music discovery features of Spotify with the rating and trending features of IMDB. Built with React and Tailwind CSS.

## Features

- **Home Page**: Discover featured tracks and new releases
- **Trending**: View popular tracks with filtering by time range (week/month/year)
- **Playlists**: Browse and manage your music playlists
- **Liked Songs**: Keep track of your favorite music in one place
- **Responsive Design**: Fully responsive layout that works on mobile and desktop
- **Modern UI**: Beautiful and intuitive user interface with smooth transitions

## Tech Stack

- **Frontend Framework**: React.js (Functional Components + Hooks)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-imdb.git
   cd spotify-imdb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
spotify-imdb/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── shared/
│   │       └── TrackCard.jsx
│   ├── context/
│   │   └── SpotifyContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Trending.jsx
│   │   ├── Playlists.jsx
│   │   └── LikedSongs.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── package.json
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Vite](https://vitejs.dev/)
