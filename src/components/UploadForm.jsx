import { useState, useEffect } from 'react';
import { addSong, updateSong } from '../api/songService';

export default function UploadForm({ isOpen, onClose, onSongAdded, editingSong }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    url: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize form data when opening (for edit mode)
  useEffect(() => {
    if (isOpen && editingSong) {
      setFormData({
        title: editingSong.title || '',
        artist: editingSong.artist || '',
        album: editingSong.album || '',
        genre: editingSong.genre || '',
        url: editingSong.url || '',
      });
    } else if (isOpen) {
      // Reset for new song
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        url: '',
      });
    }
    setErrors({});
  }, [isOpen, editingSong]);

  if (!isOpen) return null;

  const isEditMode = !!editingSong;

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if URL is from an unsupported source
  const isUnsupportedUrl = (url) => {
    const unsupported = [
      'youtube.com',
      'youtu.be',
      'spotify.com',
      'soundcloud.com',
      'twitch.tv',
      'instagram.com',
    ];
    return unsupported.some((domain) => url.toLowerCase().includes(domain));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const songData = {
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album.trim() || null,
        genre: formData.genre.trim() || null,
        url: formData.url.trim(),
      };

      if (isEditMode) {
        // Update existing song
        await updateSong(editingSong.id, songData);
        setToast({
          type: 'success',
          message: 'Song updated!',
        });
      } else {
        // Add new song
        await addSong(songData);
        setToast({
          type: 'success',
          message: 'Song added!',
        });
      }

      // Reset form
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        url: '',
      });
      setErrors({});

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        onSongAdded?.();
        setToast(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving song:', error);
      setToast({
        type: 'error',
        message: isEditMode
          ? 'Failed to update song. Try again.'
          : 'Failed to add song. Try again.',
      });
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle backdrop click - prevent close while submitting
  const handleBackdropClick = (e) => {
    if (!isSubmitting && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Song' : 'Upload Song'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Song title"
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded border outline-none transition ${
                errors.title
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-600 focus:border-green-500'
              } disabled:opacity-50`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Artist Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Artist *
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Artist name"
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded border outline-none transition ${
                errors.artist
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-600 focus:border-green-500'
              } disabled:opacity-50`}
            />
            {errors.artist && (
              <p className="text-red-500 text-xs mt-1">{errors.artist}</p>
            )}
          </div>

          {/* Album Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Album
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Album name (optional)"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 outline-none transition disabled:opacity-50"
            />
          </div>

          {/* Genre Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Genre (optional)"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 outline-none transition disabled:opacity-50"
            />
          </div>

          {/* URL Field */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Audio URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="https://example.com/song.mp3"
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded border outline-none transition ${
                errors.url
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-600 focus:border-green-500'
              } disabled:opacity-50`}
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url}</p>
            )}
            
            {/* Warning for unsupported URLs */}
            {formData.url && isUnsupportedUrl(formData.url) && (
              <div className="bg-yellow-900 border border-yellow-600 text-yellow-100 px-3 py-2 rounded text-xs mt-2">
                ⚠️ <strong>Warning:</strong> This URL is from a streaming service and won't play in this app.
                <br />
                Use direct audio file URLs (.mp3, .wav) instead.
                <br />
                Try: <code className="bg-black bg-opacity-30 px-1">https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3</code>
              </div>
            )}
            
            {/* Helpful hint */}
            {formData.url && !isUnsupportedUrl(formData.url) && isValidUrl(formData.url) && (
              <p className="text-green-400 text-xs mt-1">✓ URL format looks good</p>
            )}
          </div>

          {/* Form Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Update' : 'Upload')}
            </button>
          </div>
        </form>
      </div>

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
    </div>
  );
}