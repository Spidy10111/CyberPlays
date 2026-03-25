import { Track } from "@/data/sampleTracks";
import TrackCard from "@/components/player/TrackCard";
import { motion } from "framer-motion";

interface TrackSectionProps {
  title: string;
  tracks: Track[];
}

const TrackSection = ({ title, tracks }: TrackSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4 tracking-wide">
        {title}
      </h3>
      <div className="space-y-1">
        {tracks.map((track, i) => (
          <TrackCard key={track.id} track={track} index={i} />
        ))}
      </div>
    </motion.section>
  );
};

export default TrackSection;
