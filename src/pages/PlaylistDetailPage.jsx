import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { getAllSongs } from '../api/songService';
import SongCard from '../components/SongCard';
import SongCardSkeleton from '../components/SongCardSkeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import { useState, useEffect } from 'react';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlaylist, removeSongFromPlaylist } = usePlaylist();
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, songId: null });
  const playlist = getPlaylist(id);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getAllSongs();
        setAllSongs(songs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (!playlist) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pb-48 md:pb-32">
        <p className="text-gray-400 text-center py-12">Playlist not found</p>
        <button
          onClick={() => navigate('/playlists')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          ← Back to Playlists
        </button>
      </div>
    );
  }

  // Filter songs to only those in the playlist
  const playlistSongs = allSongs.filter((song) =>
    playlist.songIds.includes(song.id)
  );

  const handleRemove = (songId) => {
    removeSongFromPlaylist(playlist.id, songId);
    setDeleteConfirm({ open: false, songId: null });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-48 md:pb-32">
      <button
        onClick={() => navigate('/playlists')}
        className="text-gray-400 hover:text-white transition mb-4 text-sm"
      >
        ← Back to Playlists
      </button>

      <h1 className="text-white text-3xl font-bold mb-2">{playlist.name}</h1>
      <p className="text-gray-500 text-sm mb-8">
        {playlistSongs.length} {playlistSongs.length === 1 ? 'song' : 'songs'}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : playlistSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlistSongs.map((song) => (
            <div key={song.id} className="relative group">
              <SongCard
                song={song}
                queue={playlistSongs}
                onSongsUpdate={() => {}}
              />
              <button
                onClick={() => setDeleteConfirm({ open: true, songId: song.id })}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🎵</p>
          <p className="text-gray-400 text-lg">No songs in this playlist yet</p>
          <p className="text-gray-500 text-sm mt-2">Add songs from the Songs page</p>
        </div>
      )}

      <ConfirmDialog
        title="Remove Song"
        message="Are you sure you want to remove this song from the playlist?"
        isOpen={deleteConfirm.open}
        onConfirm={() => handleRemove(deleteConfirm.songId)}
        onCancel={() => setDeleteConfirm({ open: false, songId: null })}
      />
    </div>
  );
}