import { useState, useEffect } from 'react';
import { getAllSongs } from '../api/songService';
import { useFavorites } from '../context/FavoritesContext';
import SongCard from '../components/SongCard';
import SongCardSkeleton from '../components/SongCardSkeleton';

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const allSongs = await getAllSongs();
        setSongs(allSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Filter songs to only those in favoriteIds
  const favoriteSongs = songs.filter((song) => favoriteIds.includes(song.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-48 md:pb-32">
      <h1 className="text-white text-3xl font-bold mb-8">My Favorites</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : favoriteSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {favoriteSongs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              queue={favoriteSongs}
              onSongsUpdate={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">♥</p>
          <p className="text-gray-400 text-lg">No favorites yet</p>
          <p className="text-gray-500 text-sm mt-2">Add your favorite songs from the Songs page</p>
        </div>
      )}
    </div>
  );
}