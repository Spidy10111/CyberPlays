import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const NowPlayingBar = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    previous,
    progress,
    duration,
    seek,
    volume,
    setVolume,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-20 glass-surface border-t border-border z-50"
      >
        <div className="flex items-center h-full px-4 gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-[280px] min-w-0">
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 neon-border">
              <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center">
                <span className="text-primary text-lg font-display">♪</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className="ml-1 flex-shrink-0"
            >
              <Heart
                size={16}
                className={currentTrack.liked ? "fill-primary text-primary" : "text-muted-foreground hover:text-foreground"}
              />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex-1 flex flex-col items-center gap-1 max-w-[600px] mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`transition-colors ${shuffle ? "text-primary neon-text" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Shuffle size={16} />
              </button>
              <button onClick={previous} className="text-foreground hover:text-primary transition-colors">
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform neon-glow"
              >
                {isPlaying ? (
                  <Pause size={18} className="text-primary-foreground" />
                ) : (
                  <Play size={18} className="text-primary-foreground ml-0.5" />
                )}
              </button>
              <button onClick={next} className="text-foreground hover:text-primary transition-colors">
                <SkipForward size={20} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`transition-colors ${repeat !== "off" ? "text-primary neon-text" : "text-muted-foreground hover:text-foreground"}`}
              >
                {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-muted-foreground w-10 text-right">{formatTime(progress)}</span>
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={([v]) => seek(v)}
                className="flex-1 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-[0_0_8px_hsl(186_100%_50%/0.5)] [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_.range]:bg-primary h-1"
              />
              <span className="text-[10px] text-muted-foreground w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-[160px] justify-end">
            <button
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v / 100)}
              className="w-24 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_.range]:bg-primary h-1"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NowPlayingBar;
