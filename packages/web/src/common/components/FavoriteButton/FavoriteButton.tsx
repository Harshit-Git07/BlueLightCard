import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/pro-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/pro-solid-svg-icons';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import { FavoriteButtonProps } from './types';

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ curFavBtnState, onFavouriteClick }) => {
  return (
    <Button
      variant={ThemeVariant.Tertiary}
      slim
      withoutHover
      className="w-fit m-1"
      onClick={() => curFavBtnState !== 'error' && onFavouriteClick()}
    >
      <span
        className={`${
          curFavBtnState === 'error' && 'text-palette-danger-base'
        } text-base font-['MuseoSans'] font-bold leading-6`}
      >
        <FontAwesomeIcon
          icon={curFavBtnState === 'favourite' ? faStarSolid : faStarRegular}
          className="mr-2"
        />
        {curFavBtnState === 'error' ? 'Failed to update' : 'Favourite'}
      </span>
    </Button>
  );
};

export default FavoriteButton;
