import React, { useState, useContext, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { OfferSheetProps, RedemptionResponse } from './types';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';
import OfferSheetContext, { offerResponse } from '@/context/OfferSheet/OfferSheetContext';
import OfferGetDiscount from './OfferGetDiscount/OfferGetDiscount';
import DesktopShowCardOrQrCode from './DesktopShowCardOrQrCode/DesktopShowCardOrQrCode';
import MobileShowCardOrQrCode from './MobileShowCardOrQrCode/MobileShowCardOrQrCode';
import { displayDateDDMMYYYY } from '@core/utils/date';
import { getOfferById } from '@/utils/offers/getOffer';
import AmplitudeContext from '@/context/AmplitudeContext';
import Heading from '@/components/Heading/Heading';
import Link from '@/components/Link/Link';
import Button from '../Button/Button';
import { logOfferView } from '@/utils/amplitude/logOfferView';
import { ENVIRONMENT } from '@/global-vars';
import { useMediaQuery } from 'usehooks-ts';

const OfferSheet: React.FC<OfferSheetProps> = ({
  offer: { offerId, companyId, companyName },
  onButtonClick,
}) => {
  const { setLabels, offerLabels, open, setOpen } = useContext(OfferSheetContext);
  const router = useRouter();

  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 500px)');
  const amplitude = useContext(AmplitudeContext);

  const blankOffer: offerResponse = {};
  const blankRedemption: RedemptionResponse = {};
  const [offerData, setOfferData] = useState(blankOffer);
  const [isLoading, setIsLoading] = useState(false);
  const [redemptionData, setRedemptionData] = useState<RedemptionResponse>(blankRedemption);
  const [loadOfferError, setLoadOfferError] = useState(false);

  const copyCodeToClipboard = async (redemptionDataResponse: RedemptionResponse) => {
    try {
      if (redemptionDataResponse?.redemptionDetails?.code) {
        await navigator.clipboard.writeText(redemptionDataResponse?.redemptionDetails.code);
        if (ENVIRONMENT === 'local') console.log('Content copied to clipboard');
      }
    } catch (err) {
      if (ENVIRONMENT === 'local') console.error('Failed to copy: ', err);
    }
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
        if (dateFormatted) labels.push(`Expiry: ${dateFormatted}`);
      }

      setLabels(labels);
      setIsLoading(false);
    }
  };

  // Redemption API call on Get Discount button click
  const handleOnGetDiscountClick = async () => {
    setIsLoading(true);
    const mockedRedemptionApiRes: RedemptionResponse = {
      redemptionType: 'generic',
      redemptionDetails: {
        code: 'BLC25OFF',
        url: 'https://awin1.com/',
      },
    };

    const redemptionDataResponse: RedemptionResponse = mockedRedemptionApiRes;

    // TODO on API integration, else should fallback to legacy API
    if (redemptionDataResponse) {
      setRedemptionData(redemptionDataResponse);
      setIsLoading(false);
      copyCodeToClipboard(redemptionDataResponse);
    } else {
      router.push(`/out.php?lid=${offerData.id}&cid=${offerData.companyId}`);
    }
  };

  // render components based on redemption type vaultQR or ShowCard
  const renderOfferOnRedemptionType = (): ReactElement => {
    if (
      !Object.keys(redemptionData).length ||
      redemptionData.redemptionType === 'generic' ||
      redemptionData.redemptionType === 'vault' ||
      redemptionData.redemptionType === 'preApplied'
    ) {
      return (
        <OfferGetDiscount
          {...{
            offer: { offerId, companyId, companyName },
            offerData,
            onButtonClick: onButtonClick || handleOnGetDiscountClick,
            companyId,
            redemptionData,
          }}
        />
      );
    }

    switch (redemptionData.redemptionType) {
      case 'vaultQR':
      case 'showCard': {
        if (isMobile) {
          return (
            <MobileShowCardOrQrCode
              redemptionType={redemptionData.redemptionType}
              offerData={offerData}
              companyId={companyId as string}
            />
          );
        } else {
          return (
            <DesktopShowCardOrQrCode
              redemptionType={redemptionData.redemptionType}
              companyName={offerData?.name?.slice(10) as string}
              companyId={companyId as string}
              offerData={offerData}
            />
            /* CompanyName - Nedd to clarify if this can come from other place. */
          );
        }
      }
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if ((userCtx.user || companyId) && open && !offerData.id) {
      setLoadOfferError(false);
      fetchofferSheetDetails();
    }
  }, [userCtx.user, offerId, companyId, open]);

  useEffect(() => {
    if (!open) {
      setRedemptionData(blankRedemption);
      setOfferData(blankOffer);
      setLoadOfferError(false);
      setIsLoading(false);
    }
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
          <Heading headingLevel={'h2'} className=" text-black">
            Error loading offer
          </Heading>
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
      {open && !isLoading && !loadOfferError && <>{renderOfferOnRedemptionType()}</>}
    </DynamicSheet>
  );
};

export default OfferSheet;
