import { usePlayer } from "@/context/PlayerContext";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart,
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
    currentTrack, isPlaying, togglePlay, next, previous,
    progress, duration, seek, volume, setVolume,
    shuffle, toggleShuffle, repeat, toggleRepeat, toggleLike,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 md:bottom-0 left-0 right-0 z-40 glass-strong"
        style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Mobile: compact */}
        <div className="md:hidden p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-sm">♪</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={() => toggleLike(currentTrack.id)}>
              <Heart size={16} className={currentTrack.liked ? "fill-foreground text-foreground" : "text-muted-foreground"} />
            </button>
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              {isPlaying ? <Pause size={14} className="text-background" /> : <Play size={14} className="text-background ml-0.5" />}
            </button>
          </div>
          <div className="mt-2">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.1}
              onValueChange={([v]) => seek(v)}
              className="[&_[role=slider]]:bg-foreground [&_[role=slider]]:border-foreground [&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_.range]:bg-foreground h-0.5"
            />
          </div>
        </div>

        {/* Desktop: full */}
        <div className="hidden md:flex items-center h-20 px-4 gap-4">
          <div className="flex items-center gap-3 w-[260px] min-w-0">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground">♪</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={() => toggleLike(currentTrack.id)} className="ml-1 flex-shrink-0">
              <Heart size={16} className={currentTrack.liked ? "fill-foreground text-foreground" : "text-muted-foreground hover:text-foreground"} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 max-w-[560px] mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Shuffle size={15} strokeWidth={1.5} />
              </button>
              <button onClick={previous} className="text-foreground/80 hover:text-foreground transition-colors">
                <SkipBack size={18} strokeWidth={1.5} />
              </button>
              <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform apple-shadow">
                {isPlaying ? <Pause size={16} className="text-background" /> : <Play size={16} className="text-background ml-0.5" />}
              </button>
              <button onClick={next} className="text-foreground/80 hover:text-foreground transition-colors">
                <SkipForward size={18} strokeWidth={1.5} />
              </button>
              <button onClick={toggleRepeat} className={`transition-colors ${repeat !== "off" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {repeat === "one" ? <Repeat1 size={15} strokeWidth={1.5} /> : <Repeat size={15} strokeWidth={1.5} />}
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-[10px] text-muted-foreground w-9 text-right tabular-nums">{formatTime(progress)}</span>
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={([v]) => seek(v)}
                className="flex-1 [&_[role=slider]]:bg-foreground [&_[role=slider]]:border-foreground [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_.range]:bg-foreground h-1"
              />
              <span className="text-[10px] text-muted-foreground w-9 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-[150px] justify-end">
            <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-muted-foreground hover:text-foreground transition-colors">
              {volume === 0 ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
            </button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v / 100)}
              className="w-24 [&_[role=slider]]:bg-foreground [&_[role=slider]]:border-foreground [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_.range]:bg-foreground h-1"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NowPlayingBar;
