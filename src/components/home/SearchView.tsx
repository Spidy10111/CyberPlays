import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import TrackCard from "@/components/player/TrackCard";
import { motion } from "framer-motion";

const genres = ["All", "Synthwave", "Electronic", "Ambient", "Chillwave", "Darkwave", "Synthpop"];

const SearchView = () => {
  const { tracks } = usePlayer();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  const filtered = useMemo(() => {
    return tracks.filter((t) => {
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase()) ||
        t.album.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genre === "All" || t.genre === genre;
      return matchesQuery && matchesGenre;
    });
  }, [tracks, query, genre]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tracks, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary focus:neon-border transition-all"
          />
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              genre === g
                ? "bg-primary text-primary-foreground neon-glow"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-12">No tracks found</p>
        ) : (
          filtered.map((track, i) => <TrackCard key={track.id} track={track} index={i} />)
        )}
      </div>
    </div>
  );
};

export default SearchView;
