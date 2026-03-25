import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

const HeroSection = () => {
  const { tracks, play } = usePlayer();
  const featured = tracks[2];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-2xl overflow-hidden mb-8 glass hover-lift"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/3" />
      <div className="relative p-6 md:p-10">
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium"
        >
          Featured
        </motion.p>
        <motion.h2
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold text-foreground mb-2 tracking-tight"
        >
          {featured?.title || "Quantum Drift"}
        </motion.h2>
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm md:text-base mb-6"
        >
          {featured?.artist} · {featured?.album}
        </motion.p>
        <motion.button
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => featured && play(featured)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity apple-shadow"
        >
          <Play size={16} className="ml-0.5" />
          Play Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroSection;
