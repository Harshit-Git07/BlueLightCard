import React, { useState, useContext, useEffect } from 'react';
import { OfferSheetProps } from './types';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import { ThemeVariant } from '@/types/theme';
import {
  faStar as faStarSolid,
  faWandMagicSparkles,
  faArrowUpFromBracket,
  faCheck,
  faX,
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
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { displayDateDDMMYYYY } from '@core/utils/date';
import OfferSheetContext, { offerResponse } from '@/context/OfferSheet/OfferSheetContext';
import { retrieveFavourites, UpdateFavourites } from '@/utils/company/favourites';
import { getOfferById } from '@/utils/offers/getOffer';
import amplitudeEvents from '@/utils/amplitude/events';
import AmplitudeContext from '@/context/AmplitudeContext';
import Heading from '@/components/Heading/Heading';
import Link from '@/components/Link/Link';
import { logOfferView } from '@/utils/amplitude/logOfferView';

const OfferSheet: React.FC<OfferSheetProps> = ({
  offer: { offerId, companyId, companyName },
  onButtonClick,
}) => {
  const { setLabels, offerLabels, open, setOpen } = useContext(OfferSheetContext);
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const amplitude = useContext(AmplitudeContext);

  const [magicButtonState, setMagicButtonState] = useState<'primary' | 'secondary'>('primary');
  const [shareBtnState, setShareBtnState] = useState<'share' | 'error' | 'success'>('share');
  const [curFavBtnState, setFavBtnState] = useState<
    'favourite' | 'unfavourite' | 'disabled' | 'error'
  >('disabled');
  const [expanded, setExpanded] = useState(false);
  const blankOffer: offerResponse = {};
  const [offerData, setOfferData] = useState(blankOffer);
  const [isLoading, setIsLoading] = useState(false);
  const [loadOfferError, setLoadOfferError] = useState(false);

  const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);
  const imageSource = offerData.companyLogo ?? finalFallbackImage;

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

  const buttonClickEvent = () => {
    setMagicButtonState('secondary');
    if (amplitude) {
      amplitude.setUserId(userCtx.user?.uuid ?? '');
      amplitude.trackEventAsync(amplitudeEvents.VAULT_CODE_REQUEST_CLICKED, {
        company_id: companyId,
        company_name: companyName,
        offer_id: offerId,
        offer_name: offerData.name,
        source: 'sheet',
      });
    }
    if (onButtonClick) {
      onButtonClick();
    } else if (offerData.id && offerData.companyId)
      // I hate this. But it was requested so that the can see the message
      setTimeout(() => {
        window.open(`/out.php?lid=${offerData.id}&cid=${offerData.companyId}`);
      }, 1500);
  };

  const logAmpOfferView = (eventSource: string) => {
    logOfferView(
      amplitude,
      userCtx.user?.uuid || '',
      eventSource,
      router.route,
      offerId,
      offerData.name,
      companyId,
      companyName
    );
  };

  const fetchofferSheetDetails = async () => {
    setIsLoading(true);
    const offerDataResponse = await getOfferById(authCtx.authState.idToken, offerId);
    if (!offerDataResponse || typeof offerDataResponse === null) {
      setOfferData(blankOffer);
      setIsLoading(false);
      setLoadOfferError(true);
    } else {
      logAmpOfferView('sheet');
      setOfferData(offerDataResponse);

      let labels: string[] = [];

      const { expiry, type } = offerDataResponse;

      if (type) labels.push(type);

      if (expiry) {
        let dateFormatted = displayDateDDMMYYYY(expiry);
        if (dateFormatted) labels.push(dateFormatted);
      }

      setLabels(labels);
      setIsLoading(false);
    }
  };

  const fetchFavourite = async () => {
    const favouriteCompany = (await retrieveFavourites(companyId)) ? 'favourite' : 'unfavourite';
    setFavBtnState(favouriteCompany);
  };

  useEffect(() => {
    if (userCtx.user || companyId) {
      setLoadOfferError(false);
      setExpanded(false);
      fetchFavourite();
      fetchofferSheetDetails();
    }
  }, [userCtx.user, offerId, companyId]);

  useEffect(() => {
    setMagicButtonState('primary');
    setShareBtnState('share');
  }, [open]);

  return (
    <DynamicSheet
      isOpen={open}
      onClose={() => setOpen && setOpen(false)}
      showCloseButton
      containerClassName="flex flex-col justify-between w-full"
    >
      {isLoading && (
        <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />
      )}
      {loadOfferError && (
        <div className="text-palette-primary text-center mx-4 space-y-4">
          <Heading headingLevel={'h2'}>Error loading offer</Heading>
          <p className="text-base">
            Refresh the page and try again. If this problem persists contact member services on Live
            Chat&nbsp;
            <Link href={'https://www.bluelightcard.co.uk/contactblc.php'} className={'underline'}>
              here
            </Link>
          </p>

          <p>Alternatively, you can still visit your offer page and get your discount there</p>
          <Button
            type={'link'}
            href={`/offerdetails.php?cid=${companyId}&oid=${offerId}`}
            onClick={() => logAmpOfferView('page')}
          >
            {companyName}
          </Button>
        </div>
      )}
      {/* Top section - Product info, share/fav etc. */}
      {!isLoading && !loadOfferError && (
        <div className="flex flex-col text-center text-wrap space-y-2 p-6 pt-0 font-['MuseoSans']">
          <div className="pb-16">
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

            <Heading headingLevel={'h2'} className={'leading-8 mt-4 !text-black'}>
              {offerData.name}
            </Heading>

            <p
              className={`text-base font-light font-['MuseoSans'] leading-5 mt-2 ${
                offerData.description && offerData.description.length > 300 && !expanded
                  ? 'mobile:line-clamp-3 tablet:line-clamp-4 desktop:line-clamp-5'
                  : ''
              }`}
            >
              {offerData.description}
            </p>

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
                  {shareBtnState === 'share'
                    ? 'Share'
                    : shareBtnState === 'success'
                    ? 'Link Copied'
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
              {offerData.terms && (
                <Accordion title="Terms and Conditions" content={offerData.terms} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom section - Button labels etc */}
      {!loadOfferError && (
        <div className="w-full h-fit pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
          <div className="w-full flex flex-wrap mb-2 justify-center">
            {offerLabels &&
              offerLabels.map((label, index) => (
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
                <Heading
                  headingLevel={'h5'}
                  className={'text-white h-full text-center text-nowrap mb-0'}
                >
                  Get Discount
                </Heading>
              </div>
            ) : (
              <div className="flex-col w-full min-h-7 text-nowrap whitespace-nowrap flex-nowrap">
                <div className="text-md font-bold text-center">
                  <FontAwesomeIcon icon={faWandMagicSparkles} /> Discount automatically applied
                </div>
                <div className="text-sm">Redirecting you to partner website</div>
              </div>
            )}
          </MagicButton>
        </div>
      )}
    </DynamicSheet>
  );
};

export default OfferSheet;
