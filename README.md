# Spotify Clone

Hey there! This is my Spotify clone project that I built for my web development class. It's basically a simplified version of Spotify that lets you browse playlists, artists, and new releases. I had a lot of fun building this and learned a ton about React and API integration!

## What It Does

- **Home Page**: Shows you new releases and featured playlists
- **Search**: Find music, artists, and playlists
- **Artist Details**: Check out artist info and their popular tracks
- **Playlist Details**: See what songs are in a playlist
- **Responsive Design**: Works on my phone and laptop (which is all I care about tbh)

## Tech Stuff I Used

- **React**: For building the UI (functional components + hooks)
- **React Router**: For navigation between pages
- **Tailwind CSS**: For styling (way easier than writing CSS from scratch)
- **Spotify API**: To get real music data (had to get an API key which was a pain)

## How to Run It

1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/spotify-clone.git
   cd spotify-clone
   ```

2. Install the dependencies:
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
spotify-clone/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── ArtistDetails.jsx
│   │   ├── PlaylistDetails.jsx
│   │   ├── TrackCard.jsx
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── ArtistDetails.css
│   │   └── PlaylistDetails.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Search.jsx
│   ├── services/
│   │   └── spotifyService.js
│   ├── config.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── package.json
```

## What I Learned

- How to use React hooks (useState, useEffect)
- How to fetch data from an API
- How to handle loading states and errors
- How to use React Router for navigation
- How to style with Tailwind CSS

## Known Issues

- The API key expires after a while, so you'll need to update it in config.js
- Some images might not load (I'm using placeholder images as fallbacks)
- The app doesn't actually play music (that would require more API permissions)

## Future Improvements

- Add user authentication
- Add a music player
- Add more pages and features
- Improve the UI/UX

## Credits

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spotify API](https://developer.spotify.com/documentation/web-api/)
- [Vite](https://vitejs.dev/)

Feel free to use this code for your own projects or assignments (just give me credit if you do 😉).
