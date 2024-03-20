import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faCheck, faX } from '@fortawesome/pro-solid-svg-icons';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import { ShareButtonProps } from './types';
import Check from './Check.svg';

const ShareButton: React.FC<ShareButtonProps> = ({
  onShareClick,
  shareBtnState,
  hasText = true,
}) => {
  return (
    <Button
      variant={ThemeVariant.Tertiary}
      slim
      withoutHover
      className="w-fit m-1 mobile:px-0 mobile:py-0"
      onClick={onShareClick}
    >
      <span
        className={`${
          shareBtnState === 'error' && 'text-palette-danger-base'
        } text-base font-['MuseoSans'] font-bold leading-6 flex flex-row`}
      >
        {shareBtnState !== 'share' ? (
          <div className="my-auto">
            <Check />
          </div>
        ) : (
          <div className="my-auto">
            <FontAwesomeIcon
              icon={
                shareBtnState === 'share'
                  ? faArrowUpFromBracket
                  : shareBtnState === 'success'
                  ? faCheck
                  : faX
              }
              className="mr-2"
            />
          </div>
        )}
        {hasText &&
          (shareBtnState === 'share'
            ? 'Share'
            : shareBtnState === 'success'
            ? 'Copied to clipboard'
            : 'Failed to copy')}
      </span>
    </Button>
  );
};

export default ShareButton;
