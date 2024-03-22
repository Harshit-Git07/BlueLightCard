import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMedia } from 'react-use';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import { ShareButtonProps } from './types';
import Check from './Check.svg';
import CheckCircle from './CheckCircle.svg';
import ErrorCircle from './ErrorCircle.svg';

const ShareButton: React.FC<ShareButtonProps> = ({
  showShareLabel = true,
  shareDetails,
  shareLabel = 'Share',
}) => {
  const isMobile = useMedia('(max-width: 500px)');

  const [shareBtnState, setShareBtnState] = useState<'share' | 'error' | 'success'>('share');

  const copyLink = () => {
    if (!shareDetails.url) return;
    if (!navigator.clipboard) {
      return false;
    }
    navigator.clipboard.writeText(shareDetails.url);
    return true;
  };

  const handleLinkCopiedWhenNoLabel = () => {
    const success = copyLink();

    if (success) {
      toast.success('Link copied', {
        position: 'bottom-center',
        icon: <CheckCircle />,
        toastId: 'link-copied-success',
        closeButton: false,
      });
    } else {
      toast.error('Failed to copy link', {
        position: 'bottom-center',
        icon: <ErrorCircle />,
        toastId: 'link-copied-error',
        closeButton: false,
      });
    }
  };

  const handleShareClick = () => {
    if (isMobile && !showShareLabel && shareDetails) {
      // Open native share drawer on mobile
      if (navigator.share) {
        navigator.share({
          title: shareDetails.name,
          text: shareDetails.description,
          url: shareDetails.url,
        });
      } else {
        // If navigator.share is not supported by browser run bellow fallback on mobile
        handleLinkCopiedWhenNoLabel();
      }
      return;
    }

    if (showShareLabel) {
      // When share button displays icon and label
      const success = copyLink();
      if (success) {
        setShareBtnState('success');
        setTimeout(() => setShareBtnState('share'), 4000);
      } else {
        setShareBtnState('error');
        setTimeout(() => setShareBtnState('share'), 4000);
      }
    } else {
      // When share button only displays the sharing icon
      handleLinkCopiedWhenNoLabel();
    }
  };

  return (
    <Button
      variant={ThemeVariant.Tertiary}
      slim
      withoutHover
      className="w-fit m-1 mobile:px-0 mobile:py-0 min-h-6 laptop:min-h-fit"
      onClick={handleShareClick}
    >
      <div
        className={`${
          shareBtnState === 'error' && 'text-palette-danger-base'
        } text-base font-['MuseoSans'] font-bold leading-6 flex flex-row`}
      >
        <div className="my-auto">
          {shareBtnState && shareBtnState === 'success' ? (
            <Check data-testid="check-icon" />
          ) : (
            <FontAwesomeIcon
              icon={shareBtnState === 'share' ? faArrowUpFromBracket : faX}
              data-testid={
                shareBtnState === 'share' ? 'font-awesome-share-icon' : 'font-awesome-error-icon'
              }
            />
          )}
        </div>
        {showShareLabel && (
          <span className="ml-2">
            {shareBtnState === 'share'
              ? shareLabel
              : shareBtnState === 'success'
              ? 'Link copied'
              : 'Failed to copy'}
          </span>
        )}
      </div>
    </Button>
  );
};

export default ShareButton;
