import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

const HeroSection = () => {
  const { tracks, play } = usePlayer();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-xl overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 via-background to-neon-cyan/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="relative p-8 md:p-12">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-medium"
        >
          Featured Track
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 neon-text"
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
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition-transform neon-glow"
        >
          <Play size={18} className="ml-0.5" />
          Play Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroSection;
