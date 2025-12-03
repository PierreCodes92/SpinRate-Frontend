import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/components/TranslationProvider';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoplayDuration?: number;
}

const VideoPlayer = ({ src, className = "", autoplayDuration = 4500 }: VideoPlayerProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [hasStartedFull, setHasStartedFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Autoplay initial
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        video.currentTime = 0;
        await video.play();
        setIsPlaying(true);

        // Arrêt après 4-5 secondes
        const timer = setTimeout(() => {
          video.pause();
          setIsPlaying(false);
          setShowContinueButton(true);
        }, autoplayDuration);

        return () => clearTimeout(timer);
      } catch (error) {
        console.log('Autoplay failed:', error);
        setShowContinueButton(true);
      }
    };

    attemptAutoplay();
  }, [autoplayDuration]);

  // Update time and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  const handleContinue = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);
    await video.play();
    setIsPlaying(true);
    setShowContinueButton(false);
    setHasStartedFull(true);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleProgressClick(e);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => hasStartedFull && setShowControls(true)}
      onMouseLeave={() => hasStartedFull && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full cursor-pointer"
        playsInline
        preload="metadata"
        onClick={hasStartedFull ? togglePlayPause : undefined}
        style={{
          aspectRatio: '9/16',
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundColor: 'transparent'
        }}
      />

      {/* Bouton "Écouter la suite" */}
      {showContinueButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={handleContinue}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full flex items-center space-x-3 shadow-button transition-all hover:scale-105"
          >
            <Play className="w-6 h-6 fill-white" />
            <span className="text-lg font-semibold">{t('watchTheRest')}</span>
          </button>
        </div>
      )}

      {/* Contrôles personnalisés */}
      {hasStartedFull && !showContinueButton && (
        <>
          {/* Contrôles en bas */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Barre de progression */}
            <div 
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 relative"
              onClick={handleProgressClick}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseMove={handleProgressDrag}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Boutons de contrôle */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="hover:scale-110 transition-transform"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <span className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Contrôle Play/Pause sur mobile (petit en bas à gauche) */}
          <div className="md:hidden absolute bottom-4 left-4">
            <button
              onClick={togglePlayPause}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
