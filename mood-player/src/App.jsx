import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Camera } from "lucide-react";

export default function App() {
  const songs = [
    {
      id: 1,
      title: "Happy Vibes",
      artist: "Artist A",
      src: "https://ik.imagekit.io/binod12/audio/68b08c3f0439a7b7fc8f6759_y35gL1rqS?updatedAt=1756400707016",
      img: "https://via.placeholder.com/120/FF7A93/FFFFFF?text=HV"
    },
    {
      id: 2,
      title: "Chill Mood",
      artist: "Artist B",
      src: "https://ik.imagekit.io/binod12/audio/68b08a0b0439a7b7fc8f6756_J3tFz1fwE?updatedAt=1756400143029",
      img: "https://via.placeholder.com/120/7AC7FF/FFFFFF?text=CM"
    },
    {
      id: 3,
      title: "Energetic Beats",
      artist: "Artist C",
      src: "https://ik.imagekit.io/binod12/audio/68b089e70439a7b7fc8f6753_pew7SK_ju?updatedAt=1756400108235",
      img: "https://via.placeholder.com/120/FFE07A/222222?text=EB"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef(null);

  const currentSong = songs[currentIndex];

  // When currentIndex changes, load the new source and play if needed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentSong.src;
    audio.load();

    const tryPlay = async () => {
      try {
        if (isPlaying) await audio.play();
      } catch (e) {
        // autoplay might be blocked; keep state consistent
        setIsPlaying(false);
      }
    };

    setProgress(0);
    setDuration(0);
    tryPlay();
  }, [currentIndex]);

  // Event listeners for time updates and metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => {
      // auto-next or stop at end
      if (currentIndex < songs.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex]);

  // Sync volume whenever it changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        // autoplay might be blocked
        setIsPlaying(false);
      }
    }
  };

  const selectSong = (index) => {
    if (index === currentIndex) {
      togglePlay();
      return;
    }
    setCurrentIndex(index);
    setIsPlaying(true);
    // play is attempted in effect after load
  };

  const prevTrack = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : songs.length - 1));
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentIndex((i) => (i < songs.length - 1 ? i + 1 : 0));
    setIsPlaying(true);
  };

  const onSeek = (value) => {
    if (!audioRef.current || !duration) return;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gray-900 text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-gradient-x" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto h-full flex flex-col p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Mood Music Player</h1>
        </header>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Camera + Detect */}
          <section className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="w-full bg-white/8 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-center h-56">
              <Camera className="w-10 h-10 text-white/60" />
              <span className="ml-3 text-sm text-white/70">Camera preview</span>
            </div>

            <button className="w-full bg-white/10 hover:bg-white/15 py-3 rounded-xl transition text-sm">
              Detect Mood
            </button>
          </section>

          {/* Middle: Song list */}
          <section className="md:col-span-2">
            <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/10 p-4 h-[calc(100vh-240px)] overflow-y-auto pb-40">
              <h2 className="text-lg font-semibold mb-3">Song List</h2>
              <ul className="space-y-3">
                {songs.map((s, idx) => (
                  <li
                    key={s.id}
                    onClick={() => selectSong(idx)}
                    className={`flex items-center justify-between gap-4 p-3 rounded-xl cursor-pointer transition hover:bg-white/10 ${
                      idx === currentIndex ? "bg-white/12 border border-white/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.img} alt={s.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-white/70">{s.artist}</p>
                      </div>
                    </div>

                    <div className="text-sm text-white/60">{idx === currentIndex && isPlaying ? "Playing" : "Play"}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* Spacer so content doesn't get hidden behind fixed player */}
        <div className="h-28" />
      </div>

      {/* Fixed bottom player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/10 p-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <img src={currentSong.img} alt={currentSong.title} className="w-14 h-14 rounded-md object-cover" />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{currentSong.title}</p>
                <p className="text-sm text-white/70">{currentSong.artist}</p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={prevTrack} aria-label="Previous track" className="p-2 rounded-md hover:bg-white/6">
                  <SkipBack size={20} />
                </button>

                <button onClick={togglePlay} aria-label="Play pause" className="p-2 rounded-full bg-pink-500 hover:bg-pink-600">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button onClick={nextTrack} aria-label="Next track" className="p-2 rounded-md hover:bg-white/6">
                  <SkipForward size={20} />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(progress)}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Volume */}
          <div className="w-36 flex items-center gap-2">
            <Volume2 />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  );
}
