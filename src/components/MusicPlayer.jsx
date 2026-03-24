import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

// Drop your audio file at: public/music.mp3
// Change the track name below to match your song
const TRACK = {
  src: "/music.mp3",
  title: "Background Music",
  artist: "Your Artist",
};

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [expanded, setExpanded] = useState(false);
  const [hasFile, setHasFile] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setHasFile(false));
      setPlaying(true);
    }
  }

  function handleVolumeChange(e) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }

  function handleEnded() {
    setPlaying(false);
  }

  return (
    <div className={`music-player ${expanded ? "expanded" : ""}`}>
      <audio
        ref={audioRef}
        src={TRACK.src}
        onEnded={handleEnded}
        loop
      />

      <div className="music-player-bar">
        <button
          className="music-toggle"
          onClick={() => setExpanded(!expanded)}
          title="Toggle player"
        >
          ♪
        </button>

        {expanded && (
          <>
            <div className="music-info">
              <span className="music-title">{TRACK.title}</span>
              <span className="music-artist">{TRACK.artist}</span>
            </div>

            <button
              className={`music-play-btn ${playing ? "playing" : ""}`}
              onClick={togglePlay}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="music-volume"
              title="Volume"
            />

            {!hasFile && (
              <span className="music-no-file" title="Add music.mp3 to the public folder">!</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
