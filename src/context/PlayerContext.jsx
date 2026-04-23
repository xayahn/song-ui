import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.crossOrigin = 'anonymous';

      // Update current time on timeupdate event
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      // Update duration when metadata is loaded
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      // Auto-play next song when current ends
      audioRef.current.addEventListener('ended', handleAutoPlayNext);

      // Error handling for debugging
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', {
          code: e.target.error?.code,
          message: e.target.error?.message,
          song: currentSong?.title,
          url: currentSong?.url
        });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', handleAutoPlayNext);
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  // Play a song with a queue
  const playSong = (song, songQueue = []) => {
    if (!song || !song.url) {
      console.warn('Song or URL is missing', song);
      return;
    }

    console.log('Playing song:', song.title, 'URL:', song.url);

    // Update queue if provided
    if (songQueue.length > 0) {
      setQueue(songQueue);
      const songIndex = songQueue.findIndex((s) => s.id === song.id);
      setCurrentIndex(songIndex >= 0 ? songIndex : 0);
    }

    // Set and play the song
    setCurrentSong(song);
    audioRef.current.src = song.url;
    
    // Add promise handling for play
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio playback started successfully');
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Audio playback failed:', error);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentSong || !currentSong.url) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Play next song in queue
  const nextSong = () => {
    if (queue.length === 0) return;

    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex], queue);
  };

  // Play previous song in queue
  const prevSong = () => {
    if (queue.length === 0) return;

    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex], queue);
  };

  // Auto-play next when current song ends
  const handleAutoPlayNext = () => {
    nextSong();
  };

  // Set seek position
  const setPlaybackTime = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Set volume
  const setPlayerVolume = (vol) => {
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  const value = {
    currentSong,
    queue,
    isPlaying,
    currentTime,
    duration,
    volume,
    currentIndex,
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    setPlaybackTime,
    setPlayerVolume,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};