import { useState } from "react";
import Sidebar, { MobileNav, MobileHeader, MobileSheet } from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/player/NowPlayingBar";
import HeroSection from "@/components/home/HeroSection";
import TrackSection from "@/components/home/TrackSection";
import SearchView from "@/components/home/SearchView";
import LikedSongsView from "@/components/home/LikedSongsView";
import Equalizer from "@/components/player/Equalizer";
import { usePlayer } from "@/context/PlayerContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { tracks, currentTrack } = usePlayer();

  const trending = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const recent = tracks.slice(0, 4);

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">Search</h2>
            <SearchView />
          </div>
        );
      case "liked":
        return <LikedSongsView />;
      case "equalizer":
        return <Equalizer />;
      case "library":
      case "playlists":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
              {activeTab === "library" ? "Your Library" : "Playlists"}
            </h2>
            <p className="text-muted-foreground text-sm">Coming soon — sign in to save your library.</p>
          </div>
        );
      default:
        return (
          <>
            <HeroSection />
            <TrackSection title="Trending Now" tracks={trending} />
            <TrackSection title="Recently Added" tracks={recent} />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenuOpen={() => setMenuOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto scrollbar-cyber p-4 md:p-8 ${
          currentTrack ? "pb-32 md:pb-28" : "pb-20 md:pb-8"
        }`}>
          {renderContent()}
        </main>
      </div>

      <MobileSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <NowPlayingBar />
      {currentTrack && <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default Index;
