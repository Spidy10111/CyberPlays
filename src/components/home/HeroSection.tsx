import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

const HeroSection = () => {
  const { tracks, play } = usePlayer();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-2xl overflow-hidden mb-8 glass-card"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/3" />
      <div className="relative p-6 sm:p-8 md:p-12">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 font-medium"
        >
          Featured Track
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2 text-glow"
        >
          {tracks[2]?.title || "Quantum Drift"}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-6"
        >
          {tracks[2]?.artist || "Nyx"} · {tracks[2]?.album || "Afterglow"}
        </motion.p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => tracks[2] && play(tracks[2])}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform"
        >
          <Play size={18} className="ml-0.5" />
          Play Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroSection;
