import { useContext, useEffect, useState } from 'react';
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';
import OfferSheetContext from '@/context/OfferSheet/OfferSheetContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/pro-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/pro-solid-svg-icons';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import { FavouriteButtonProps } from './types';
import { retrieveFavourites, UpdateFavourites } from '@/utils/company/favourites';

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  offerData,
  companyId,
  hasText = true,
}) => {
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const { open } = useContext(OfferSheetContext);
  const [curFavBtnState, setFavBtnState] = useState<
    'favourite' | 'unfavourite' | 'disabled' | 'error' | ''
  >('disabled');

  const onFavouriteClick = async () => {
    if (await UpdateFavourites(offerData, authCtx.authState.idToken, userCtx.user?.legacyId)) {
      setFavBtnState(curFavBtnState === 'favourite' ? 'unfavourite' : 'favourite');
    } else {
      const originalState = curFavBtnState;
      setFavBtnState('error');
      setTimeout(() => setFavBtnState(originalState), 1500);
    }
  };

  const fetchFavourite = async () => {
    const favouriteCompany = (await retrieveFavourites(companyId)) ? 'favourite' : 'unfavourite';
    setFavBtnState(favouriteCompany);
  };

  useEffect(() => {
    fetchFavourite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCtx.user, offerData.id, companyId]);

  useEffect(() => {
    if (!open) {
      setFavBtnState('unfavourite');
    }
  }, [open]);

  return (
    <Button
      variant={ThemeVariant.Tertiary}
      slim
      withoutHover
      className="w-fit mx-1 mobile:px-0"
      onClick={() =>
        curFavBtnState !== 'error' && curFavBtnState !== 'disabled' && onFavouriteClick()
      }
    >
      <span
        className={`${
          curFavBtnState === 'error' && 'text-palette-danger-base'
        } text-base font-['MuseoSans'] font-bold leading-6 flex items-center`}
      >
        <FontAwesomeIcon
          icon={curFavBtnState === 'favourite' ? faStarSolid : faStarRegular}
          className="desktop:mr-2 mr-0"
        />

        {hasText && (curFavBtnState === 'error' ? 'Failed to update' : 'Favourite')}
      </span>
    </Button>
  );
};

export default FavouriteButton;
