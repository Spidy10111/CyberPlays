import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Music, BarChart3, Upload, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";

const AdminPanel = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { tracks } = usePlayer();

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass rounded-2xl p-8 apple-shadow-lg text-center max-w-sm">
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground">You don't have admin privileges.</p>
      </div>
    </div>
  );

  const stats = [
    { label: "Total Tracks", value: tracks.length, icon: Music },
    { label: "Total Plays", value: tracks.reduce((a, t) => a + t.plays, 0).toLocaleString(), icon: BarChart3 },
    { label: "Genres", value: [...new Set(tracks.map(t => t.genre))].length, icon: Upload },
    { label: "Artists", value: [...new Set(tracks.map(t => t.artist))].length, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
              <Music size={16} className="text-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">Admin Panel</span>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 md:p-5 hover-lift"
            >
              <stat.icon size={18} className="text-muted-foreground mb-3" />
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Track Management */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">All Tracks</h3>
            <button className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Upload size={14} /> Upload
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Artist</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Genre</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Plays</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id} className="border-b border-border/50 group">
                    <td className="py-3">
                      <p className="text-sm font-medium text-foreground">{track.title}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{track.artist}</p>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground hidden sm:table-cell">{track.artist}</td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{track.genre}</span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground hidden md:table-cell">{track.plays.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
