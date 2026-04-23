import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    setPlaybackTime,
    setPlayerVolume,
    nextSong,
    prevSong,
    audioRef,
  } = usePlayer();

  const [hasAudio, setHasAudio] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show player when song is loaded
  useEffect(() => {
    if (currentSong && currentSong.url) {
      setHasAudio(true);
      setIsVisible(true);
    } else {
      setHasAudio(false);
    }
  }, [currentSong]);

  if (!isVisible || !currentSong) {
    return null;
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    setPlaybackTime(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setPlayerVolume(parseFloat(e.target.value));
  };

  // Truncate long text with ellipsis
  const truncateText = (text, maxLength = 40) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Fixed bottom player bar with slide-up animation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 animate-slideUp shadow-2xl z-40">
        <div className="max-w-6xl mx-auto">
          {/* Song Info Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              {hasAudio && currentSong.url ? (
                <>
                  <p className="text-white font-semibold truncate text-sm">
                    {truncateText(currentSong.title, 50)}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {truncateText(currentSong.artist, 40)}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No audio available</p>
              )}
            </div>
          </div>

          {/* Progress/Seek Bar */}
          {hasAudio && currentSong.url && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-xs whitespace-nowrap">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                disabled={!hasAudio}
                className="flex-1 h-1 bg-gray-700 rounded cursor-pointer hover:h-2 transition-all disabled:opacity-50"
              />
              <span className="text-gray-400 text-xs whitespace-nowrap">
                {formatTime(duration)}
              </span>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Play Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevSong}
                disabled={!hasAudio}
                className="text-white hover:text-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                title="Previous song"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                disabled={!hasAudio}
                className="text-white hover:text-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-2xl"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={nextSong}
                disabled={!hasAudio}
                className="text-white hover:text-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                title="Next song"
              >
                ⏭
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                disabled={!hasAudio}
                className="w-20 h-1 bg-gray-700 rounded cursor-pointer hover:h-2 transition-all disabled:opacity-50"
                title="Volume"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content overlap */}
      <div className="h-24" />
    </>
  );
}