import { useState, useEffect, useRef } from 'react';
import { getAllSongs, searchSongs } from '../api/songService';

export default function SearchBar({ onResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is empty, restore full list
    if (!searchQuery.trim()) {
      setIsSearching(true);
      getAllSongs()
        .then((songs) => {
          onResults(songs);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error('Error fetching all songs:', error);
          setIsSearching(false);
        });
      return;
    }

    // Debounce the search API call by 400ms
    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      searchSongs(searchQuery)
        .then((songs) => {
          onResults(songs);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error('Error searching songs:', error);
          setIsSearching(false);
        });
    }, 400);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, onResults]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search songs, artists..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-green-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              title="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        {isSearching && (
          <div className="px-4 py-2 text-gray-400 text-sm flex items-center">
            Searching...
          </div>
        )}
      </div>
    </div>
  );
}