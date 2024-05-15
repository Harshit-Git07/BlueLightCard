import { Context, FC, createContext, useContext, useState } from 'react';
import { PlatformVariant } from '../../types';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { usePlatformAdapter } from '../../adapters';
import { OfferDetails, OfferMeta, OfferStatus } from '../OfferSheet/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../OfferSheet/store';
import { getOffer } from '../../api/offers';

type IOfferDetailsContext = {
  viewOffer: (offerId: number, companyId: number, companyName: string) => Promise<void>;
};
const OfferDetailsContext: Context<IOfferDetailsContext> = createContext({
  viewOffer: (offerId: number, companyId: number, companyName: string) => Promise.resolve(),
});
export const useOfferDetails = () => useContext(OfferDetailsContext);

type ViewOfferProviderProps = {
  children?: React.ReactNode;
};

export const ViewOfferProvider: FC<ViewOfferProviderProps> = ({ children }) => {
  const platformAdapter = usePlatformAdapter();
  const { isOpen } = useAtomValue(offerSheetAtom);
  const setOfferAtom = useSetAtom(offerSheetAtom);
  const { OfferDetailsComponent, updateOfferDetailsComponent } =
    useOfferDetailsComponent(platformAdapter);

  const [offerMeta, setOfferMeta] = useState<OfferMeta | undefined>();
  const [offerDetails, setOfferDetails] = useState<OfferDetails | undefined>();
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('pending');

  const viewOffer = async (offerId: number, companyId: number, companyName: string) => {
    /*
    Run the V5 api call when the experiment is active
    Similar logic to useOfferDetailsComponent.tsx
    */
    try {
      const data = await getOffer(platformAdapter, offerId);

      setOfferDetails(data as OfferDetails);
      setOfferMeta({
        offerId: data.id,
        companyId: data.companyId,
        companyName: companyName,
      });
      setOfferStatus('success');
    } catch (err) {
      setOfferDetails({
        id: offerId,
        companyId,
        companyLogo: undefined,
        description: undefined,
        expiry: undefined,
        name: undefined,
        terms: undefined,
        type: undefined,
      });
      setOfferMeta({
        companyId: companyId,
        companyName: companyName,
        offerId: offerId,
      });
      setOfferStatus('error');
    }

    await updateOfferDetailsComponent(offerId);
    setOfferAtom((prev) => ({ ...prev, isOpen: true }));
  };

  const onClose = () => {
    setOfferAtom((prev) => ({ ...prev, isOpen: false }));
    // Delay the reset of the offer details to allow the animation to complete
    setTimeout(() => {
      setOfferAtom((prev) => ({ ...prev, showRedemptionPage: false }));
    }, 300);
  };

  return (
    <OfferDetailsContext.Provider value={{ viewOffer }}>
      {children}
      <div
        className={`w-full h-full transition-visibility duration-1000 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <OfferDetailsComponent
          amplitudeEvent={({ event, params }) => {
            platformAdapter.logAnalyticsEvent(event, params);
          }}
          BRAND="blc-uk"
          cdnUrl="https://cdn.bluelightcard.co.uk"
          isMobileHybrid={platformAdapter.platform === PlatformVariant.MobileHybrid}
          isOpen={isOpen}
          offerStatus={offerStatus}
          offerDetails={offerDetails}
          offerMeta={offerMeta}
          onClose={onClose}
          platform={platformAdapter.platform}
        />
      </div>
    </OfferDetailsContext.Provider>
  );
};
