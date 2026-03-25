import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/player/NowPlayingBar";
import HeroSection from "@/components/home/HeroSection";
import TrackSection from "@/components/home/TrackSection";
import SearchView from "@/components/home/SearchView";
import LikedSongsView from "@/components/home/LikedSongsView";
import Equalizer from "@/components/player/Equalizer";
import { usePlayer } from "@/context/PlayerContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { tracks, currentTrack } = usePlayer();
  const navigate = useNavigate();

  const trending = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const recent = tracks.slice(0, 4);

  const handleTabChange = (tab: string) => {
    if (tab === "admin") {
      navigate("/admin");
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Search</h2>
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
            <h2 className="text-2xl font-semibold text-foreground mb-6">
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
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className={`flex-1 overflow-y-auto scrollbar-minimal p-4 sm:p-6 md:p-8 pt-16 md:pt-6 ${currentTrack ? "pb-28" : ""}`}>
        {renderContent()}
      </main>
      <NowPlayingBar />
    </div>
  );
};

export default Index;
