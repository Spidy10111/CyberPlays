export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl: string;
  plays: number;
  liked: boolean;
}

// Using free sample audio from various sources
export const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "Cyber Pulse",
    album: "Digital Horizon",
    genre: "Synthwave",
    duration: 224,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 1243500,
    liked: false,
  },
  {
    id: "2",
    title: "Midnight Circuit",
    artist: "REZON8",
    album: "Wired",
    genre: "Electronic",
    duration: 198,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 892300,
    liked: true,
  },
  {
    id: "3",
    title: "Holographic Rain",
    artist: "Nyx",
    album: "Afterglow",
    genre: "Ambient",
    duration: 267,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 2105000,
    liked: false,
  },
  {
    id: "4",
    title: "Binary Sunset",
    artist: "Datastream",
    album: "Source Code",
    genre: "Chillwave",
    duration: 312,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    plays: 567800,
    liked: true,
  },
  {
    id: "5",
    title: "Electric Veins",
    artist: "Cyber Pulse",
    album: "Digital Horizon",
    genre: "Synthwave",
    duration: 245,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    plays: 1789200,
    liked: false,
  },
  {
    id: "6",
    title: "Ghost Protocol",
    artist: "REZON8",
    album: "Wired",
    genre: "Darkwave",
    duration: 189,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    plays: 432100,
    liked: false,
  },
  {
    id: "7",
    title: "Quantum Drift",
    artist: "Nyx",
    album: "Afterglow",
    genre: "Ambient",
    duration: 356,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    plays: 3210000,
    liked: true,
  },
  {
    id: "8",
    title: "Chrome Heart",
    artist: "Datastream",
    album: "Source Code",
    genre: "Synthpop",
    duration: 203,
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    plays: 945600,
    liked: false,
  },
];
