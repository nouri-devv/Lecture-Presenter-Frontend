import { useEffect, useRef, useState } from "react";

interface ControlProps {
  currentSlide: number;
  currentAudio: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  audioUrl: string | null;
}

export function Control({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  audioUrl,
}: ControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      setProgress(0);

      const playAudio = () => {
        audioRef.current
          ?.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Autoplay failed:", error);
            setIsPlaying(false);
          });
      };

      if (audioRef.current.readyState >= 2) {
        playAudio();
      } else {
        const handleCanPlay = () => {
          playAudio();
          audioRef.current?.removeEventListener("canplay", handleCanPlay);
        };

        audioRef.current.addEventListener("canplay", handleCanPlay);

        // Cleanup
        return () => {
          audioRef.current?.removeEventListener("canplay", handleCanPlay);
        };
      }
    }
  }, [audioUrl, currentSlide]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }

    // Automatically advance to next slide if not on the last slide
    if (currentSlide < totalSlides) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-black/80 p-5 w-full">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Audio controls */}
      <div className="flex items-center justify-center gap-4 w-full max-w-3xl">
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-white">{formatTime(progress)}</span>
          <div className="relative flex-1 h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="absolute h-full bg-blue-500"
              style={{
                width: `${duration ? (progress / duration) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <span className="text-sm text-white">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={onPrev}
          disabled={currentSlide <= 1}
          className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
        >
          Prev
        </button>
        <span className="text-lg text-white">
          {currentSlide} / {totalSlides}
        </span>
        <button
          onClick={onNext}
          disabled={currentSlide >= totalSlides}
          className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
