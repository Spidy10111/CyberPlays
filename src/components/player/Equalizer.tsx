import { useState, useEffect, useRef, useCallback } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const EQ_BANDS = [
  { freq: 60, label: "60" },
  { freq: 170, label: "170" },
  { freq: 350, label: "350" },
  { freq: 1000, label: "1K" },
  { freq: 3500, label: "3.5K" },
  { freq: 10000, label: "10K" },
];

const PRESETS: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0, 0],
  Bass: [6, 4, 1, 0, -1, -2],
  Treble: [-2, -1, 0, 1, 4, 6],
  "V-Shape": [5, 2, -2, -2, 2, 5],
  Vocal: [-1, 0, 3, 4, 2, 0],
  Electronic: [4, 3, 0, -1, 2, 4],
};

const Equalizer = () => {
  const { audioElement, isPlaying } = usePlayer();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const connectedRef = useRef(false);

  const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [activePreset, setActivePreset] = useState("Flat");
  const [isConnected, setIsConnected] = useState(false);

  const connectAudio = useCallback(() => {
    if (!audioElement || connectedRef.current) return;

    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioElement);
      sourceRef.current = source;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const filters = EQ_BANDS.map((band, i) => {
        const filter = ctx.createBiquadFilter();
        filter.type = i === 0 ? "lowshelf" : i === EQ_BANDS.length - 1 ? "highshelf" : "peaking";
        filter.frequency.value = band.freq;
        filter.gain.value = 0;
        filter.Q.value = 1.4;
        return filter;
      });
      filtersRef.current = filters;

      // Chain: source -> filters -> analyser -> destination
      source.connect(filters[0]);
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
      }
      filters[filters.length - 1].connect(analyser);
      analyser.connect(ctx.destination);

      connectedRef.current = true;
      setIsConnected(true);
    } catch (e) {
      console.warn("EQ connection failed:", e);
    }
  }, [audioElement]);

  // Connect when audio element is ready and playing
  useEffect(() => {
    if (audioElement && isPlaying && !connectedRef.current) {
      connectAudio();
    }
  }, [audioElement, isPlaying, connectAudio]);

  // Visualizer drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, "hsl(0, 0%, 60%)");
        gradient.addColorStop(0.5, "hsl(0, 0%, 80%)");
        gradient.addColorStop(1, "hsl(0, 0%, 100%)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        ctx.shadowColor = "hsl(0, 0%, 70%)";
        ctx.shadowBlur = 3;

        x += barWidth;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isConnected, isPlaying]);

  const handleGainChange = (index: number, value: number) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
    setActivePreset("");

    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = value;
    }
  };

  const applyPreset = (name: string) => {
    const preset = PRESETS[name];
    if (!preset) return;
    setGains(preset);
    setActivePreset(name);
    preset.forEach((g, i) => {
      if (filtersRef.current[i]) {
        filtersRef.current[i].gain.value = g;
      }
    });
  };

  const resetEQ = () => applyPreset("Flat");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Equalizer</h2>
        <button
          onClick={resetEQ}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Visualizer */}
      <div className="rounded-xl bg-card border border-border p-4 neon-border">
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          className="w-full h-[120px] rounded-lg"
        />
        {!isConnected && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Play a track to activate the visualizer
          </p>
        )}
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Presets
        </p>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activePreset === name
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* EQ Sliders */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-end justify-between gap-4">
          {EQ_BANDS.map((band, i) => (
            <div key={band.freq} className="flex flex-col items-center gap-3 flex-1">
              <span className="text-xs font-mono text-primary">
                {gains[i] > 0 ? "+" : ""}
                {gains[i]}
              </span>
              <div className="h-40 flex items-center">
                <Slider
                  orientation="vertical"
                  value={[gains[i]]}
                  min={-12}
                  max={12}
                  step={1}
                  onValueChange={([v]) => handleGainChange(i, v)}
                  className="h-full [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-[0_0_8px_hsl(186_100%_50%/0.5)] [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_.range]:bg-primary"
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{band.label}</span>
              <span className="text-[8px] text-muted-foreground/50">Hz</span>
            </div>
          ))}
        </div>
      </div>

      {/* dB scale reference */}
      <div className="flex justify-between text-[10px] text-muted-foreground/50 px-2">
        <span>-12 dB</span>
        <span>0 dB</span>
        <span>+12 dB</span>
      </div>
    </motion.div>
  );
};

export default Equalizer;
