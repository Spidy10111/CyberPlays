import { Home, Search, Library, Heart, SlidersHorizontal, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  { id: "equalizer", label: "Equalizer", icon: SlidersHorizontal },
];

const NavContent = ({ activeTab, onTabChange, onClose }: SidebarProps & { onClose?: () => void }) => {
  const { user, isAdmin, signOut } = useAuth();

  const handleNav = (id: string) => {
    onTabChange(id);
    onClose?.();
  };

  return (
    <>
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
            <span className="text-foreground text-sm font-semibold">▶</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">CYBRPLAY</span>
        </div>
        <div className="h-px bg-border mt-4" />
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Library */}
      <div className="px-5 mt-6 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Library</p>
      </div>
      <nav className="px-3 space-y-0.5">
        {libraryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3 space-y-1">
        <div className="h-px bg-border mb-3" />
        <ThemeToggle />
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
                Admin Panel
              </Link>
            )}
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all text-left">
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
            Sign In
          </Link>
        )}
      </div>
    </>
  );
};

// Mobile Bottom Nav
export const MobileNav = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {[...navItems, { id: "liked", label: "Liked", icon: Heart }].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Mobile Header
export const MobileHeader = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  return (
    <div className="glass-strong sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center">
          <span className="text-foreground text-xs font-semibold">▶</span>
        </div>
        <span className="font-semibold tracking-tight text-foreground">CYBRPLAY</span>
      </div>
      <button onClick={onMenuOpen} className="text-foreground p-1">
        <Menu size={22} strokeWidth={1.5} />
      </button>
    </div>
  );
};

// Mobile Sheet
export const MobileSheet = ({ open, onClose, activeTab, onTabChange }: SidebarProps & { open: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 md:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-72 glass-strong z-50 flex flex-col py-6 md:hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <NavContent activeTab={activeTab} onTabChange={onTabChange} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="hidden md:flex w-56 h-full glass-surface flex-col py-6 flex-shrink-0">
      <NavContent activeTab={activeTab} onTabChange={onTabChange} />
    </aside>
  );
};

export default Sidebar;
