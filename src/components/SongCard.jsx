import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';
import { deleteSong } from '../api/songService';
import PlaylistModal from './PlaylistModal';
import ConfirmDialog from './ConfirmDialog';
import UploadForm from './UploadForm';

export default function SongCard({ song, onSongsUpdate, queue = [] }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylist();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlayClick = () => {
    playSong(song, queue.length > 0 ? queue : [song]);
  };

  const handleFavoriteClick = () => {
    toggleFavorite(song.id);
  };

  const handlePlaylistAdd = () => {
    setIsPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = (playlistId) => {
    addSongToPlaylist(playlistId, song.id);
    setIsPlaylistModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSong(song.id);
      
      // Show success toast
      setToast({
        type: 'success',
        message: 'Song deleted',
      });

      setIsDeleteConfirmOpen(false);
      
      // Call parent update to refresh song list
      setTimeout(() => {
        onSongsUpdate?.();
        setToast(null);
      }, 2000);
    } catch (error) {
      console.error('Error deleting song:', error);
      setToast({
        type: 'error',
        message: 'Failed to delete song. Try again.',
      });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition">
        {/* Cover Image */}
        {song.coverImage && (
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}

        {/* Title */}
        <h3 className="text-white font-semibold truncate text-sm">{song.title}</h3>

        {/* Artist */}
        <p className="text-gray-400 text-xs truncate">{song.artist}</p>

        {/* Album */}
        {song.album && (
          <p className="text-gray-500 text-xs truncate mb-2">{song.album}</p>
        )}

        {/* Genre Badge */}
        {song.genre && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              {song.genre}
            </span>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          className={`w-full py-2 rounded transition text-sm font-semibold mb-2 ${
            isCurrentSong && isPlaying
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isCurrentSong && isPlaying ? '▶ Playing' : '▶ Play'}
        </button>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          {/* Favorite */}
          <button
            onClick={handleFavoriteClick}
            className={`flex-1 py-2 rounded transition text-lg ${
              isFavorite(song.id)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Add to favorites"
          >
            ♥
          </button>

          {/* Add to Playlist */}
          <button
            onClick={handlePlaylistAdd}
            className="flex-1 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            title="Add to playlist"
          >
            ◎
          </button>

          {/* Edit */}
          <button
            onClick={() => setIsEditFormOpen(true)}
            className="flex-1 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            title="Edit song"
          >
            ✏
          </button>

          {/* Delete */}
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex-1 py-2 bg-gray-700 text-white rounded hover:bg-red-600 transition"
            title="Delete song"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Playlist Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Add to Playlist</h2>

            {playlists.length > 0 && (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    {playlist.name}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsPlaylistModalOpen(false)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Song Form Modal */}
      <UploadForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSongAdded={() => {
          setIsEditFormOpen(false);
          onSongsUpdate?.();
        }}
        editingSong={song}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        title="Delete Song"
        message={`Are you sure you want to delete "${song.title}"? This cannot be undone.`}
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        confirmLabel="Delete"
        confirmColor="red"
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-8 left-8 px-6 py-3 rounded-lg text-white font-semibold shadow-lg animate-slideUp ${
            toast.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}