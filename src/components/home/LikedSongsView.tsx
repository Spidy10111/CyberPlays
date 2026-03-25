import { usePlayer } from "@/context/PlayerContext";
import TrackCard from "@/components/player/TrackCard";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const LikedSongsView = () => {
  const { tracks } = usePlayer();
  const liked = tracks.filter((t) => t.liked);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center glass-card">
          <Heart size={22} className="text-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Liked Songs</h2>
          <p className="text-sm text-muted-foreground">{liked.length} tracks</p>
        </div>
      </motion.div>

      {liked.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No liked songs yet. Click the heart icon to add songs here.
        </p>
      ) : (
        <div className="space-y-1">
          {liked.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongsView;
