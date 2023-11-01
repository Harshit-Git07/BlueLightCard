import { FC, ReactEventHandler, useEffect, useRef, useState } from 'react';
import { VideoPlayerState, VideoProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faPause, faPlay } from '@fortawesome/sharp-solid-svg-icons';
import { cssUtil } from '@/utils/cssUtil';
import { faCircleExclamation, faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';

const playerStateToIcon: Record<VideoPlayerState, IconDefinition> = {
  ready: faPlay,
  loading: faSpinnerThird,
  playing: faPause,
  paused: faPlay,
  error: faCircleExclamation,
};

const Video: FC<VideoProps> = ({ videoSrc, className }) => {
  const [playerState, setPlayerState] = useState<VideoPlayerState>('loading');
  const videoRef = useRef<HTMLVideoElement>(null);

  const classes = cssUtil([
    'relative rounded-2xl overflow-hidden bg-black/30',
    playerState === 'loading' || playerState === 'error' ? 'aspect-video' : '',
    className ?? '',
  ]);
  const playerButtonClasses = cssUtil([
    'text-white/80 text-xs mobile-xl:text-3xl',
    playerState === 'error' ? 'mb-3' : '',
    playerState === 'playing' ? 'invisible group-hover:visible' : '',
    playerState !== 'error' && playerState !== 'loading' ? 'hover:text-white' : 'cursor-auto',
  ]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSrc;
    }
  }, [videoRef, videoSrc]);

  const onPlayerButtonClick: ReactEventHandler<HTMLButtonElement> = () => {
    if (playerState === 'playing') {
      videoRef.current?.pause();
    } else if (playerState === 'paused' || playerState === 'ready') {
      videoRef.current?.play();
    }
  };

  return (
    <div className={classes}>
      <video
        ref={videoRef}
        aria-label="Player"
        onPlay={() => setPlayerState('playing')}
        onPause={() => setPlayerState('paused')}
        onLoadedData={() => setPlayerState('ready')}
        onError={() => setPlayerState('error')}
      ></video>
      <div className="flex flex-col text-white/80 items-center justify-center absolute w-full h-full top-0 bg-black/30 group">
        <button
          aria-label="Player button"
          className={playerButtonClasses}
          onClick={onPlayerButtonClick}
        >
          <FontAwesomeIcon
            icon={playerStateToIcon[playerState]}
            size="6x"
            spin={playerState === 'loading'}
          />
        </button>
        {playerState === 'error' && <p>We are unable to play the video</p>}
      </div>
    </div>
  );
};

export default Video;
