import React, { use, useContext, useEffect } from 'react';
import { OfferSheetProps } from './types';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import { ThemeVariant } from '@/types/theme';
import {
  faStar as faStarSolid,
  faWandMagicSparkles,
  faArrowUpFromBracket,
} from '@fortawesome/pro-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from '../Accordion/Accordion';
import Button from '../Button/Button';
import MagicButton from '../MagicButton/MagicButton';
import Label from '../Label/Label';
import Image from '@/components/Image/Image';
import getCDNUrl from '@/utils/getCDNUrl';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  UPDATE_FAVOURITE_ENDPOINT,
  RETRIEVE_FAVOURITE_ENDPOINT,
  LEGACY_MICROSERVICE_BRAND,
} from '@/global-vars';
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';

const OfferSheet: React.FC<OfferSheetProps> = ({
  open,
  setOpen,
  offer: { offerId, companyId, offerName, offerDescription, image, termsAndConditions },
  labels,
  onButtonClick,
}) => {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);

  const [magicButtonState, setMagicButtonState] = React.useState<'primary' | 'secondary'>(
    'primary'
  );
  const [shareBtnState, setShareBtnState] = React.useState<'share' | 'error' | 'success'>('share');
  const [curFavBtnState, setFavBtnState] = React.useState<
    'favourite' | 'unfavourite' | 'disabled' | 'error'
  >('disabled');
  const [expanded, setExpanded] = React.useState(false);

  const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);
  const imageSource = image ?? finalFallbackImage;

  // Event handlers
  const copyLink = () => {
    const copyUrl = `${window.location.protocol}//${window.location.hostname}/offerdetails.php?cid=${companyId}&oid=${offerId}`;

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

  const retrieveFavouriteState = async () => {
    let data = {
      userId: userCtx.user?.legacyId,
      brand: LEGACY_MICROSERVICE_BRAND,
    };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: RETRIEVE_FAVOURITE_ENDPOINT,
      headers: {
        Authorization: `Bearer ${authCtx.authState.idToken}`,
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        const favouriteCompanies = res.data.data;
        if (favouriteCompanies.includes(parseInt(companyId, 10))) {
          setFavBtnState('favourite');
        }
      })
      .catch(() => setFavBtnState('unfavourite'));
  };

  const onFavouriteClick = () => {
    let data = {
      companyId: parseInt(companyId, 10),
      brand: LEGACY_MICROSERVICE_BRAND,
      userId: userCtx.user?.legacyId,
    };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: UPDATE_FAVOURITE_ENDPOINT,
      headers: {
        Authorization: `Bearer ${authCtx.authState.idToken}`,
      },
      data: data,
    };

    // Will fail due to cors on the endpoint, nice display of the error though so left it for now.
    axios(config)
      .then((res) => {
        setFavBtnState(curFavBtnState === 'favourite' ? 'unfavourite' : 'favourite');
      })
      .catch(() => {
        const originalState = curFavBtnState;
        setFavBtnState('error');
        setTimeout(() => setFavBtnState(originalState), 1500);
      });
  };

  const buttonClickEvent = () => {
    setMagicButtonState('secondary');
    if (onButtonClick) {
      onButtonClick();
    } else if (offerId && companyId) router.push(`/out.php?lid=${offerId}&cid=${companyId}`);
  };

  useEffect(() => {
    if (userCtx.user || companyId) {
      setFavBtnState('unfavourite');
      retrieveFavouriteState();
      setExpanded(false);
    }
  }, [userCtx.user, companyId]);

  return (
    <DynamicSheet
      isOpen={open}
      onClose={() => setOpen && setOpen(false)}
      showCloseButton
      containerClassName="flex flex-col justify-between w-full"
    >
      {/* Top section - Product info, share/fav etc. */}
      <div className="flex flex-col text-center text-wrap space-y-2 p-6 pt-0 font-['MuseoSans']">
        <div className="pb-16">
          <div className="flex justify-center">
            {imageSource && (
              <Image
                src={imageSource}
                alt={offerName as string}
                responsive={false}
                width={100}
                height={64}
                className="!relative object-contain object-center rounded shadow-[0_4px_12px_0_rgba(0,0,0,0.15)]"
              />
            )}
          </div>

          <h1 className="text-2xl font-bold font-['MuseoSans'] leading-8 mt-4">{offerName}</h1>

          <p
            className={`text-base font-light font-['MuseoSans'] leading-5 mt-2 ${
              offerDescription && offerDescription.length > 300 && !expanded
                ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                : ''
            }`}
          >
            {offerDescription}
          </p>

          {offerDescription && offerDescription.length > 300 && (
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

          <div className={`flex flex-wrap justify-center mt-4`}>
            <Button
              variant={ThemeVariant.Tertiary}
              slim
              withoutHover
              className="w-fit m-1"
              onClick={onShareClick}
            >
              <span
                className={`${
                  shareBtnState === 'error' && 'text-palette-danger-base'
                } text-base font-['MuseoSans'] font-bold leading-6`}
              >
                <FontAwesomeIcon icon={faArrowUpFromBracket} className="mr-2" />
                {shareBtnState === 'share'
                  ? 'Share'
                  : shareBtnState === 'success'
                  ? 'Copied to clipboard'
                  : 'Failed to copy'}
              </span>
            </Button>
            {curFavBtnState !== 'disabled' && (
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
            )}
          </div>

          <div className="w-full text-left mt-4">
            {termsAndConditions && (
              <Accordion title="Terms and Conditions" content={termsAndConditions} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom section - Button labels etc */}
      <div className="w-full pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {labels &&
            labels.map((label, index) => (
              <Label key={index} type={'normal'} text={label} className="m-1" />
            ))}
        </div>

        <MagicButton
          variant={magicButtonState}
          className="w-full"
          onClick={buttonClickEvent}
          animate={magicButtonState === 'secondary'}
          transitionDurationMs={1000}
        >
          {magicButtonState === 'primary' ? (
            <div className="leading-10 font-bold text-md">
              <h1 className="h-full text-center text-nowrap">Get Discount</h1>
            </div>
          ) : (
            <div className="flex-col min-h-7 text-nowrap">
              <div className="text-md font-bold">
                <FontAwesomeIcon icon={faWandMagicSparkles} /> Discount automatically applied
              </div>
              <div className="text-sm font-medium text-[#616266]">
                Redirecting you to partner website
              </div>
            </div>
          )}
        </MagicButton>
      </div>
    </DynamicSheet>
  );
};

export default OfferSheet;
