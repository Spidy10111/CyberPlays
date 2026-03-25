import { Home, Search, Library, Heart, ListMusic, Radio, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "library", label: "Library", icon: Library },
];

const libraryItems = [
  { id: "liked", label: "Liked Songs", icon: Heart },
  { id: "playlists", label: "Playlists", icon: ListMusic },
  { id: "radio", label: "Radio", icon: Radio },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-56 h-full glass-surface border-r border-border flex flex-col py-6 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 mb-8">
        <h1 className="font-display text-lg font-bold text-primary neon-text tracking-wider">
          CYBRPLAY
        </h1>
        <div className="h-px bg-gradient-to-r from-primary/50 to-transparent mt-3" />
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary neon-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Library section */}
      <div className="px-5 mt-8 mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your Library
        </p>
      </div>
      <nav className="px-3 space-y-1">
        {libraryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3">
        <div className="h-px bg-border mb-3" />
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
