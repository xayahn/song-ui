import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();
const FAVORITES_KEY = 'layug_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load favorite IDs from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavoriteIds(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Persist to localStorage whenever favoriteIds changes
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const isFavorite = (songId) => {
    return favoriteIds.includes(songId);
  };

  const toggleFavorite = (songId) => {
    setFavoriteIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const value = {
    favoriteIds,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};