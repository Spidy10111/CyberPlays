import { Home, Search, Library, Heart, ListMusic, SlidersHorizontal, Menu, X, Shield } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useState } from "react";

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
  { id: "equalizer", label: "Equalizer", icon: SlidersHorizontal },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 mb-8">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          CYBRPLAY
        </h1>
        <div className="h-px bg-gradient-to-r from-foreground/20 to-transparent mt-3" />
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-foreground/10 text-foreground glass-card"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
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
      <nav className="px-3 space-y-0.5">
        {libraryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3 space-y-0.5">
        <div className="h-px bg-border mb-3" />
        <button
          onClick={() => handleNav("admin")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
            activeTab === "admin"
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          <Shield size={16} strokeWidth={1.5} />
          Admin
        </button>
        <ThemeToggle />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-xl glass text-foreground"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop always visible, mobile overlay */}
      <aside
        className={`
          fixed md:static z-50 h-full w-60 glass-surface flex flex-col py-6 flex-shrink-0
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
