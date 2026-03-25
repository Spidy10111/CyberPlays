import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Upload, Music, Trash2, Edit2, LogOut, ArrowLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface SongMeta {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  audio_url: string;
  cover_url: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<SongMeta[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingSong, setEditingSong] = useState<SongMeta | null>(null);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
      fetchSongs();
    };

    checkAuth();
  }, [navigate]);

  const fetchSongs = async () => {
    const { data, error } = await supabase.from("songs" as any).select("*").order("created_at", { ascending: false });
    if (!error && data) setSongs(data as unknown as SongMeta[]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title || !artist) {
      toast.error("Title, artist, and audio file are required");
      return;
    }

    setUploading(true);
    try {
      // Upload audio
      const audioExt = audioFile.name.split(".").pop();
      const audioPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${audioExt}`;
      const { error: audioErr } = await supabase.storage.from("audio-files").upload(audioPath, audioFile);
      if (audioErr) throw audioErr;
      const { data: audioUrlData } = supabase.storage.from("audio-files").getPublicUrl(audioPath);

      // Upload cover if provided
      let coverUrl = "";
      if (coverFile) {
        const coverExt = coverFile.name.split(".").pop();
        const coverPath = `${Date.now()}-cover.${coverExt}`;
        const { error: coverErr } = await supabase.storage.from("cover-art").upload(coverPath, coverFile);
        if (!coverErr) {
          const { data: coverUrlData } = supabase.storage.from("cover-art").getPublicUrl(coverPath);
          coverUrl = coverUrlData.publicUrl;
        }
      }

      // Get audio duration
      const duration = await getAudioDuration(audioFile);

      // Insert song record
      const { error: insertErr } = await supabase.from("songs" as any).insert({
        title,
        artist,
        album: album || "Unknown",
        genre: genre || "Other",
        duration,
        audio_url: audioUrlData.publicUrl,
        cover_url: coverUrl,
      } as any);

      if (insertErr) throw insertErr;

      toast.success("Song uploaded successfully!");
      resetForm();
      fetchSongs();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        resolve(Math.round(audio.duration));
      });
      audio.addEventListener("error", () => resolve(0));
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this song?")) return;
    const { error } = await supabase.from("songs" as any).delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Song deleted");
      fetchSongs();
    }
  };

  const handleEdit = async () => {
    if (!editingSong) return;
    const { error } = await supabase.from("songs" as any).update({
      title: editingSong.title,
      artist: editingSong.artist,
      album: editingSong.album,
      genre: editingSong.genre,
    } as any).eq("id", editingSong.id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Song updated");
      setEditingSong(null);
      fetchSongs();
    }
  };

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setGenre("");
    setAudioFile(null);
    setCoverFile(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-heavy sticky top-0 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total Songs", value: songs.length },
            { label: "Artists", value: new Set(songs.map((s) => s.artist)).size },
            { label: "Albums", value: new Set(songs.map((s) => s.album)).size },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 sm:p-5"
            >
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Upload form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload size={18} />
            Upload Track
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <input
                type="text"
                placeholder="Artist *"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <input
                type="text"
                placeholder="Album"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl glass-input cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Music size={16} />
                {audioFile ? audioFile.name : "Audio file (MP3) *"}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl glass-input cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Upload size={16} />
                {coverFile ? coverFile.name : "Cover art (optional)"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Track"}
            </button>
          </form>
        </motion.div>

        {/* Song list */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">All Tracks ({songs.length})</h2>
          <div className="space-y-2">
            {songs.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
              >
                {editingSong?.id === song.id ? (
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      value={editingSong.title}
                      onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                      className="px-3 py-2 rounded-lg glass-input text-foreground text-sm focus:outline-none"
                    />
                    <input
                      value={editingSong.artist}
                      onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                      className="px-3 py-2 rounded-lg glass-input text-foreground text-sm focus:outline-none"
                    />
                    <input
                      value={editingSong.album}
                      onChange={(e) => setEditingSong({ ...editingSong, album: e.target.value })}
                      className="px-3 py-2 rounded-lg glass-input text-foreground text-sm focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleEdit} className="p-2 text-foreground hover:opacity-70">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingSong(null)} className="p-2 text-muted-foreground hover:text-foreground">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {song.cover_url ? (
                        <img src={song.cover_url} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Music size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist} · {song.album}</p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">{song.genre}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSong(song)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            {songs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">
                No songs uploaded yet. Use the form above to add tracks.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
