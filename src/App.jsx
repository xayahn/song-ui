import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Player from './components/Player';
import ToastContainer from './components/ToastContainer';
import SongsPage from './pages/SongsPage';
import FavoritesPage from './pages/FavoritesPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <PlayerProvider>
          <FavoritesProvider>
            <PlaylistProvider>
              <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="md:ml-64">
                  <Routes>
                    <Route path="/" element={<SongsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/playlists" element={<PlaylistsPage />} />
                    <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
                  </Routes>
                </div>
                <Player />
                <ToastContainer />
              </div>
            </PlaylistProvider>
          </FavoritesProvider>
        </PlayerProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;