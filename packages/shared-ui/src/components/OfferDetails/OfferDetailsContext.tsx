import { Context, FC, createContext, useContext, useState } from 'react';
import { PlatformVariant } from '../../types';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { usePlatformAdapter } from '../../adapters';
import { OfferDetails, OfferMeta, OfferStatus } from '../OfferSheet/types';
import { z } from 'zod';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../OfferSheet/store';

type IOfferDetailsContext = {
  viewOffer: (
    experiment: string,
    offerId: number,
    companyId: number,
    companyName: string,
  ) => Promise<void>;
};
const OfferDetailsContext: Context<IOfferDetailsContext> = createContext({
  viewOffer: (experiment: string, offerId: number, companyId: number, companyName: string) =>
    Promise.resolve(),
});
export const useOfferDetails = () => useContext(OfferDetailsContext);

type ViewOfferProviderProps = {
  children?: React.ReactNode;
};

const v5ResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    companyId: z.number(),
    companyLogo: z.string(),
    description: z.string(),
    expiry: z.string(),
    name: z.string(),
    terms: z.string(),
    type: z.string(),
  }),
});

export const ViewOfferProvider: FC<ViewOfferProviderProps> = ({ children }) => {
  const platformAdapter = usePlatformAdapter();
  const { isOpen } = useAtomValue(offerSheetAtom);
  const setOfferAtom = useSetAtom(offerSheetAtom);
  const { OfferDetailsComponent, updateOfferDetailsComponent } =
    useOfferDetailsComponent(platformAdapter);

  const [offerMeta, setOfferMeta] = useState<OfferMeta | undefined>();
  const [offerDetails, setOfferDetails] = useState<OfferDetails | undefined>();
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('pending');

  const viewOffer = async (
    experiment: string,
    offerId: number,
    companyId: number,
    companyName: string,
  ) => {
    /*
    Run the V5 api call when the experiment is active
    Similar logic to useOfferDetailsComponent.tsx
    */
    if (experiment === 'treatment') {
      const response = await platformAdapter.invokeV5Api(`/eu/offers/offers/${offerId}`, {
        method: 'GET',
      });

      if (response.statusCode !== 200) {
        setOfferStatus('error');
      } else {
        const data = v5ResponseSchema.parse(JSON.parse(response.body)).data;
        setOfferDetails(data as OfferDetails);
        setOfferMeta({
          offerId: data.id,
          companyId: data.companyId,
          companyName: companyName,
        });
        setOfferStatus('success');
      }
    } else {
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
    }

    await updateOfferDetailsComponent(experiment, offerId);
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
