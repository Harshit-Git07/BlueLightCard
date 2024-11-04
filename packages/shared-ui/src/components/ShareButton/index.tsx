import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { PortableTextBlock } from '@portabletext/types';
import Button from '../Button';
import { AmplitudeArg, PlatformVariant, ThemeVariant } from '../../types';
import CheckSvg from './CheckSvg';
import CheckCircleSvg from './CheckCircleSvg';
import ErrorCircleSvg from './ErrorCircleSvg';
import { offerSheetAtom } from '../OfferSheet/store';
import { useAtomValue } from 'jotai';
import { usePlatformAdapter } from '../../adapters';

type Props = {
  showShareLabel?: boolean;
  shareDetails: {
    name: string | undefined;
    description: string | PortableTextBlock | undefined;
    url: string;
  };
  shareLabel?: string;
  amplitudeDetails?: AmplitudeArg;
};

const ShareButton: FC<Props> = ({
  showShareLabel = true,
  shareDetails,
  shareLabel = 'Share',
  amplitudeDetails,
}) => {
  const platformAdapter = usePlatformAdapter();
  const { platform, amplitudeEvent } = useAtomValue(offerSheetAtom);
  const isMobile = platform === PlatformVariant.MobileHybrid;

  const [shareBtnState, setShareBtnState] = useState<'share' | 'error' | 'success'>('share');

  const copyLink = async () => {
    if (!shareDetails.url) return false;
    if (!navigator.clipboard) {
      return false;
    }
    return platformAdapter
      .writeTextToClipboard(shareDetails.url)
      .then(() => true)
      .catch(() => false);
  };

  const handleLinkCopiedWhenNoLabel = async () => {
    const success = await copyLink();

    if (success) {
      toast.success('Link copied', {
        position: 'bottom-center',
        icon: <CheckCircleSvg />,
        toastId: 'link-copied-success',
        closeButton: false,
        className:
          'py-3.5 px-4 rounded text-colour-onSurface-inverse bg-colour-surface-inverse dark:text-colour-onSurface-inverse-dark dark:bg-colour-surface-inverse-dark',
      });
    } else {
      toast.error('Failed to copy link', {
        position: 'bottom-center',
        icon: <ErrorCircleSvg />,
        toastId: 'link-copied-error',
        closeButton: false,
        className:
          'py-3.5 px-4 rounded text-colour-onSurface-inverse bg-colour-surface-inverse dark:text-colour-onSurface-inverse-dark dark:bg-colour-surface-inverse-dark',
      });
    }
  };

  const handleShareClick = async () => {
    if (amplitudeEvent && amplitudeDetails) {
      amplitudeEvent(amplitudeDetails);
    }

    if (isMobile && !showShareLabel && shareDetails) {
      // Open native share drawer on mobile
      if (platformAdapter.platform === PlatformVariant.Web && navigator.share) {
        navigator.share({
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
      const success = await copyLink();
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
      borderless
      className="w-fit m-1 mobile:px-0 mobile:py-0 min-h-6 laptop:min-h-fit"
      onClick={handleShareClick}
    >
      <div
        className={`${
          shareBtnState === 'error' && 'text-colour-error dark:text-colour-error-dark'
        } flex flex-row`}
      >
        <div className="my-auto">
          {shareBtnState && shareBtnState === 'success' ? (
            <CheckSvg data-testid="check-icon" />
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
            {(shareBtnState === 'share' && shareLabel) ||
              (shareBtnState === 'success' ? 'Link copied' : 'Failed to copy')}
          </span>
        )}
      </div>
    </Button>
  );
};

export default ShareButton;
