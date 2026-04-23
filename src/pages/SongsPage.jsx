import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import SongCard from '../components/SongCard';
import SongCardSkeleton from '../components/SongCardSkeleton';
import UploadForm from '../components/UploadForm';
import { getAllSongs } from '../api/songService';

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  // Fetch all songs on mount
  const fetchSongs = async () => {
    try {
      const data = await getAllSongs();
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Handle search results from SearchBar (via debounced API calls)
  const handleSearchResults = (results) => {
    setFilteredSongs(results);
    setSongs(results);
    setSelectedGenre(null);
    setIsSearchActive(results.length > 0);
  };

  // Handle genre filter
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    if (genre === null) {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter((song) => song.genre === genre);
      setFilteredSongs(filtered);
    }
  };

  // Derive unique genres from songs
  const uniqueGenres = Array.from(
    new Set(songs.map((song) => song.genre).filter(Boolean))
  ).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-48 md:pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">Discover Songs</h1>
        <button
          onClick={() => setIsUploadFormOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition font-semibold"
        >
          + Upload Song
        </button>
      </div>

      {/* Debounced Search Bar */}
      <div className="mb-8">
        <SearchBar onResults={handleSearchResults} />
      </div>

      {/* Genre Filter - only show if not in search mode */}
      {!isSearchActive && (
        <div className="mb-8">
          <h2 className="text-gray-300 text-sm font-semibold mb-3">Filter by Genre</h2>
          <GenreFilter
            genres={uniqueGenres}
            onGenreSelect={handleGenreSelect}
            selectedGenre={selectedGenre}
          />
        </div>
      )}

      {/* Songs Grid with Loading Skeleton and Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onSongsUpdate={() => {}} queue={filteredSongs} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-gray-400 text-lg">No songs found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Upload Song Form Modal */}
      <UploadForm
        isOpen={isUploadFormOpen}
        onClose={() => setIsUploadFormOpen(false)}
        onSongAdded={() => {
          setIsUploadFormOpen(false);
          fetchSongs();
          // Reset filters when new song is added
          setSelectedGenre(null);
          setIsSearchActive(false);
        }}
      />
    </div>
  );
}