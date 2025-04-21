# 🎵 Spotify Clone - Your Music Hub

A Spotify-inspired music app built with React and Last.fm API. Perfect for music lovers who want to discover new tracks and artists!

## 🌐 Live Site
Check it out here: [Spotify Clone](https://boisterous-mermaid-5baa81.netlify.app/)

## 🎸 Features

- 🎧 **New Releases**: Check out the latest music drops
- 🎨 **Featured Playlists**: Explore curated playlists by genre/mood
- 🎤 **Top Artists**: See who's trending in the music scene
- 🔍 **Search**: Find your favorite tracks in seconds
- 🎭 **Artist Profiles**: Dive deep into artist bios and top tracks
- 🎮 **Playlists**: Click on any playlist to explore its tracks (super fun!)

## 🎨 Tech Stack

- React for the frontend magic ✨
- Last.fm API for all the music data 🎵
- Tailwind CSS for styling 🎨
- React Router for smooth navigation 🚀

## 🎯 Why I Built This

As a college student, I wanted to create something that combines my love for music with coding. This project helped me learn React, API integration, and modern web development practices. Plus, it's a great way to discover new music while coding! 🎮

## 🎮 Fun Fact

The playlists are actually based on Last.fm tags, so you can discover music by different themes and moods. Click on any playlist to explore its tracks - it's like a musical treasure hunt! 🎵

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
