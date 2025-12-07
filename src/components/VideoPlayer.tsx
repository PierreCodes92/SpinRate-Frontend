import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/components/TranslationProvider';
import { isVideoCached, preCacheVideo } from '@/utils/serviceWorker';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoplayDuration?: number;
}

const VideoPlayer = ({ src, className = "", autoplayDuration = 4500 }: VideoPlayerProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [hasStartedFull, setHasStartedFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCached, setIsCached] = useState(false);

  // Check if video is cached on mount
  useEffect(() => {
    isVideoCached(src).then(setIsCached);
  }, [src]);

  // Pre-cache video when component mounts (for future visits)
  useEffect(() => {
    if (!isCached) {
      preCacheVideo(src);
    }
  }, [src, isCached]);

  // Intersection Observer - only load video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load video only when visible
  useEffect(() => {
    if (!isVisible || isVideoLoaded) return;
    
    const video = videoRef.current;
    if (!video) return;

    // Set the src only when visible
    video.src = src;
    video.load();
    setIsVideoLoaded(true);
  }, [isVisible, src, isVideoLoaded]);

  // Autoplay only after video is loaded and visible
  useEffect(() => {
    if (!isVideoLoaded || !isVisible) return;
    
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        video.currentTime = 0;
        await video.play();
        setIsPlaying(true);

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

    // Small delay to ensure video is ready
    const timeout = setTimeout(attemptAutoplay, 100);
    return () => clearTimeout(timeout);
  }, [isVideoLoaded, isVisible, autoplayDuration]);

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

  const handleContinue = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;
    setIsMuted(false);
    await video.play();
    setIsPlaying(true);
    setShowContinueButton(false);
    setHasStartedFull(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  }, []);

  const handleProgressDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleProgressClick(e);
  }, [isDragging, handleProgressClick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className}`}
      onMouseEnter={() => hasStartedFull && setShowControls(true)}
      onMouseLeave={() => hasStartedFull && setShowControls(false)}
    >
      {/* Placeholder shown before video loads */}
      {!isVideoLoaded && (
        <div 
          className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
          style={{ aspectRatio: '9/16' }}
        >
          <div className="text-center">
            <Play className="w-16 h-16 text-primary/50 mx-auto mb-2" />
            <span className="text-sm text-muted-foreground">{t('loadingVideo') || 'Loading...'}</span>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full cursor-pointer ${!isVideoLoaded ? 'hidden' : ''}`}
        playsInline
        preload="none"
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
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center space-x-2 md:space-x-3 shadow-button transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
            <span className="text-base md:text-lg font-semibold">{t('watchTheRest')}</span>
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
