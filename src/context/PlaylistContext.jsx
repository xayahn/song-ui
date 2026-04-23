import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PlaylistContext = createContext();
const PLAYLISTS_KEY = 'layug_playlists';

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);

  // Load playlists from localStorage on mount
  useEffect(() => {
    const storedPlaylists = localStorage.getItem(PLAYLISTS_KEY);
    if (storedPlaylists) {
      try {
        setPlaylists(JSON.parse(storedPlaylists));
      } catch (error) {
        console.error('Error loading playlists:', error);
      }
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: uuidv4(),
      name,
      songIds: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (!pl.songIds.includes(songId)) {
            return { ...pl, songIds: [...pl.songIds, songId] };
          }
        }
        return pl;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
        }
        return pl;
      })
    );
  };

  const getPlaylist = (playlistId) => {
    return playlists.find((pl) => pl.id === playlistId);
  };

  const isSongInPlaylist = (playlistId, songId) => {
    const playlist = playlists.find((pl) => pl.id === playlistId);
    return playlist ? playlist.songIds.includes(songId) : false;
  };

  const value = {
    playlists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylist,
    isSongInPlaylist,
  };

  return (
    <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within PlaylistProvider');
  }
  return context;
};