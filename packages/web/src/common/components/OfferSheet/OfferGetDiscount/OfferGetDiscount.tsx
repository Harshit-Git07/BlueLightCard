import React, { useState, useContext, useEffect, use } from 'react';
import { OfferDetails } from '../types';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MagicButton from '../../MagicButton/MagicButton';
import Label from '../../Label/Label';
import OfferSheetContext from '@/context/OfferSheet/OfferSheetContext';
import { useRouter } from 'next/router';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader/OfferTopDetailsHeader';
import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import amplitudeEvents from '@/utils/amplitude/events';
import Heading from '@/components/Heading/Heading';

const OfferGetDiscount: React.FC<OfferDetails> = ({
  offer: { offerId, companyId, companyName },
  offerData,
  onButtonClick,
  redemptionData,
}) => {
  const { offerLabels } = useContext(OfferSheetContext);
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  const [magicButtonState, setMagicButtonState] = useState<'primary' | 'secondary'>('primary');

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

    // onButtonClick is a function that should always run on the primary state of magic button
    if (magicButtonState === 'primary') {
      onButtonClick();
      return;
    }

    if (magicButtonState === 'secondary' && redemptionData?.redemptionDetails?.url) {
      router.push(redemptionData.redemptionDetails.url);
    } else if (offerData.id && offerData.companyId) {
      // I hate this. But it was requested so that the can see the message
      setTimeout(() => {
        window.open(`/out.php?lid=${offerData.id}&cid=${offerData.companyId}`);
      }, 1500);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (magicButtonState === 'secondary') {
      timeout = setTimeout(() => {
        if (redemptionData?.redemptionDetails?.url) {
          router.push(redemptionData.redemptionDetails.url);
        } else if (offerData.id && offerData.companyId) {
          window.open(`/out.php?lid=${offerData.id}&cid=${offerData.companyId}`);
        }
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [magicButtonState]);

  const renderMagicCtaLabel = () => {
    const type = redemptionData && redemptionData.redemptionType;
    // adds here to handle no redemptionData and redirect to offer legacy page for now
    if (!type) {
      return <div>Redirecting you to offer</div>;
    }

    switch (type) {
      case 'generic':
      case 'vault':
        return <div>Code copied!</div>;
      case 'preApplied':
        return <div>Discount automatically applied</div>;
    }
  };

  return (
    <>
      <OfferTopDetailsHeader {...{ offerData, companyId }} />

      {/* Bottom section - Button labels etc */}
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
            <div className="leading-10 font-bold text-md">Get Discount</div>
          ) : (
            <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
              <div className="text-md font-bold text-center flex justify-center gap-2 items-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {renderMagicCtaLabel()}
              </div>
              {redemptionData?.redemptionType && (
                <div className="text-sm text-[#616266] font-medium">
                  Redirecting to partner website
                </div>
              )}
            </div>
          )}
        </MagicButton>
      </div>
    </>
  );
};

export default OfferGetDiscount;
