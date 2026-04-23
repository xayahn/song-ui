import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function PlaylistsPage() {
  const { playlists, createPlaylist, deletePlaylist } = usePlaylist();
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName);
      setNewName('');
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    deletePlaylist(id);
    setDeleteConfirm({ open: false, id: null });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-48 md:pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">My Playlists</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          + New Playlist
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mb-8">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 outline-none transition mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-semibold text-lg group-hover:text-green-500 transition">
                  {playlist.name}
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteConfirm({ open: true, id: playlist.id });
                }}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Delete
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🎵</p>
          <p className="text-gray-400 text-lg">No playlists yet</p>
          <p className="text-gray-500 text-sm">Create a new playlist to get started</p>
        </div>
      )}

      <ConfirmDialog
        title="Delete Playlist"
        message="Are you sure you want to delete this playlist?"
        isOpen={deleteConfirm.open}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </div>
  );
}