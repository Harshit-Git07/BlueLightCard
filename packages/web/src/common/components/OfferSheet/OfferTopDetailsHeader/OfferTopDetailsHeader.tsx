import { useContext, useEffect, useState } from 'react';
import Image from '@/components/Image/Image';
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';
import OfferSheetContext from '@/context/OfferSheet/OfferSheetContext';
import getCDNUrl from '@/utils/getCDNUrl';
import { ThemeVariant } from '@/types/theme';
import { OfferTopDetailsHeaderProps } from '../types';
import Button from '../../Button/Button';
import Accordion from '../../Accordion/Accordion';
import ShareButton from '@/components/ShareButton/ShareButton';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import { retrieveFavourites, UpdateFavourites } from '@/utils/company/favourites';
import Heading from '@/components/Heading/Heading';

const OfferTopDetailsHeader: React.FC<OfferTopDetailsHeaderProps> = ({
  offerData,
  companyId,
  showOfferDescription = true,
  showShareFavorite = true,
  showTerms = true,
}) => {
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const { open } = useContext(OfferSheetContext);

  const [expanded, setExpanded] = useState(false);
  const [shareBtnState, setShareBtnState] = useState<'share' | 'error' | 'success'>('share');
  const [curFavBtnState, setFavBtnState] = useState<
    'favourite' | 'unfavourite' | 'disabled' | 'error'
  >('disabled');

  const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);
  const imageSource = offerData.companyLogo ?? finalFallbackImage;

  console.log(offerData.companyLogo && getCDNUrl(offerData.companyLogo));

  // Event handlers
  const copyLink = () => {
    const copyUrl = `${window.location.protocol}//${window.location.hostname}/offerdetails.php?cid=${offerData.companyId}&oid=${offerData.id}`;

    if (!navigator.clipboard) {
      return false;
    }
    navigator.clipboard.writeText(copyUrl);
    return true;
  };

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  const onShareClick = () => {
    const success = copyLink();
    if (success) {
      setShareBtnState('success');
    } else {
      setShareBtnState('error');
      setTimeout(() => setShareBtnState('share'), 1500);
    }
  };

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
  }, [userCtx.user, offerData.id, companyId]);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setFavBtnState('unfavourite');
      setShareBtnState('share');
    }
  }, [open]);

  return (
    <div className="flex flex-col text-center text-wrap space-y-2 p-[24px_24px_14px_24px] pt-0 font-['MuseoSans']">
      <div>
        {/* Offer Image */}
        <div className="flex justify-center">
          {imageSource && (
            <Image
              src={imageSource}
              alt={offerData.name as string}
              responsive={false}
              width={100}
              height={64}
              className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
            />
          )}
        </div>

        {/* Offer Name */}
        <Heading headingLevel={'h2'} className={'leading-8 mt-4 !text-black'}>
          {offerData.name}
        </Heading>

        {/* Offer description */}
        {showOfferDescription && (
          <>
            <p
              className={`text-base font-light font-['MuseoSans'] leading-5 mt-2 ${
                offerData.description && offerData.description.length > 300 && !expanded
                  ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                  : ''
              }`}
            >
              {offerData.description}
            </p>

            {/* Show more/less button for description */}
            {offerData.description && offerData.description.length > 300 && (
              <Button
                variant={ThemeVariant.Tertiary}
                slim
                withoutHover
                className={`w-fit`}
                onClick={handleSeeMore}
                borderless
              >
                {expanded ? 'See less' : 'See more...'}
              </Button>
            )}
          </>
        )}

        {/* Share & Favorite */}
        {showShareFavorite && (
          <div className={`flex flex-wrap justify-center mt-4`}>
            <ShareButton {...{ onShareClick, shareBtnState }} />
            {curFavBtnState !== 'disabled' && (
              <FavoriteButton {...{ curFavBtnState, onFavouriteClick }} />
            )}
          </div>
        )}

        {/* Offer Terms & Conditions */}
        {showTerms && (
          <div className="w-full text-left mt-4">
            {offerData.terms && (
              <Accordion title="Terms and Conditions" content={offerData.terms} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferTopDetailsHeader;
