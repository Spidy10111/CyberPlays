import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { Track, sampleTracks } from "@/data/sampleTracks";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  playbackSpeed: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
}

interface PlayerContextType extends PlayerState {
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (id: string) => void;
  tracks: Track[];
  audioElement: HTMLAudioElement | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    progress: 0,
    duration: 0,
    queue: [],
    playbackSpeed: 1,
    shuffle: false,
    repeat: "off",
  });

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    setAudioElement(audio);

    audio.addEventListener("timeupdate", () => {
      setState((s) => ({ ...s, progress: audio.currentTime, duration: audio.duration || 0 }));
    });

    audio.addEventListener("ended", () => {
      handleNext();
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = useCallback((track?: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (track) {
      audio.src = track.audioUrl;
      audio.load();
      setState((s) => ({ ...s, currentTrack: track, isPlaying: true }));
    }
    audio.play().catch(() => {});
    setState((s) => ({ ...s, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) pause();
    else if (state.currentTrack) play();
    else if (tracks.length > 0) play(tracks[0]);
  }, [state.isPlaying, state.currentTrack, tracks, play, pause]);

  const handleNext = useCallback(() => {
    const currentIndex = tracks.findIndex((t) => t.id === state.currentTrack?.id);
    if (state.repeat === "one") {
      const audio = audioRef.current;
      if (audio) { audio.currentTime = 0; audio.play(); }
      return;
    }
    let nextIndex: number;
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    if (nextIndex === 0 && state.repeat === "off" && !state.shuffle) {
      pause();
      return;
    }
    play(tracks[nextIndex]);
  }, [tracks, state.currentTrack, state.shuffle, state.repeat, play, pause]);

  const next = handleNext;

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === state.currentTrack?.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    play(tracks[prevIndex]);
  }, [tracks, state.currentTrack, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) audioRef.current.volume = vol;
    setState((s) => ({ ...s, volume: vol }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
    setState((s) => ({ ...s, playbackSpeed: speed }));
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setState((s) => ({ ...s, queue: [...s.queue, track] }));
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setState((s) => ({ ...s, queue: s.queue.filter((t) => t.id !== id) }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((s) => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState((s) => ({
      ...s,
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, liked: !t.liked } : t)));
    setState((s) => ({
      ...s,
      currentTrack: s.currentTrack?.id === id ? { ...s.currentTrack, liked: !s.currentTrack.liked } : s.currentTrack,
    }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        setPlaybackSpeed,
        addToQueue,
        removeFromQueue,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        tracks,
        audioElement,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
