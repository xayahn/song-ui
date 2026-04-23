import { useState } from 'react';
import { usePlaylist } from '../context/PlaylistContext';

export default function PlaylistModal({ song, isOpen, onClose }) {
  const { playlists, createPlaylist, addSongToPlaylist, isSongInPlaylist } =
    usePlaylist();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);

  if (!isOpen) return null;

  const handleAddToExisting = (playlistId) => {
    addSongToPlaylist(playlistId, song.id);
    onClose();
  };

  const handleCreateNew = () => {
    if (newPlaylistName.trim()) {
      const playlist = createPlaylist(newPlaylistName);
      addSongToPlaylist(playlist.id, song.id);
      setNewPlaylistName('');
      setShowNewPlaylist(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
        <h2 className="text-white text-xl font-bold mb-4">Add to Playlist</h2>

        {playlists.length > 0 && !showNewPlaylist && (
          <>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {playlists.map((playlist) => (
                <label
                  key={playlist.id}
                  className="flex items-center px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSongInPlaylist(playlist.id, song.id)}
                    onChange={() => handleAddToExisting(playlist.id)}
                    className="mr-3 w-4 h-4 accent-green-500 cursor-pointer"
                  />
                  <span className="flex-1">{playlist.name}</span>
                  <span className="text-xs text-gray-400">
                    {playlist.songIds.length}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowNewPlaylist(true)}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mb-2 text-sm"
            >
              + Create New Playlist
            </button>
          </>
        )}

        {(showNewPlaylist || playlists.length === 0) && (
          <div className="mb-4">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              autoFocus
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 outline-none transition mb-2"
            />
            <button
              onClick={handleCreateNew}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
            >
              Create & Add
            </button>
            {playlists.length > 0 && (
              <button
                onClick={() => {
                  setShowNewPlaylist(false);
                  setNewPlaylistName('');
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm mt-2"
              >
                Back
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}