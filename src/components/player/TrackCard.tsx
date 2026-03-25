import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Track } from "@/data/sampleTracks";

interface TrackCardProps {
  track: Track;
  index?: number;
}

const TrackCard = ({ track, index = 0 }: TrackCardProps) => {
  const { play, pause, isPlaying, currentTrack, toggleLike } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isActive && isPlaying;

  const formatPlays = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 ${
        isActive ? "bg-foreground/8 glass-subtle" : "hover:bg-foreground/5"
      }`}
      onClick={() => (isCurrentlyPlaying ? pause() : play(track))}
    >
      <div className="flex items-center gap-3">
        {/* Cover */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
          <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
            <span className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>♪</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
            {isCurrentlyPlaying ? (
              <Pause size={16} className="text-foreground" />
            ) : (
              <Play size={16} className="text-foreground ml-0.5" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? "text-foreground" : "text-foreground/90"}`}>
            {track.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{formatPlays(track.plays)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              size={14}
              className={track.liked ? "fill-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}
            />
          </button>
          <span className="text-xs text-muted-foreground">
            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackCard;
