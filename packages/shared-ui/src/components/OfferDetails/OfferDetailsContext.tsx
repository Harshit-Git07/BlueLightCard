import { Context, FC, createContext, useContext, useState } from 'react';
import { PlatformVariant } from '../../types';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { usePlatformAdapter } from '../../adapters';
import { OfferDetails, OfferMeta, OfferStatus } from '../OfferSheet/types';
import { z } from 'zod';

type IOfferDetailsContext = {
  viewOffer: (experiment: string, offerId: number, companyId: number) => Promise<void>;
};
const OfferDetailsContext: Context<IOfferDetailsContext> = createContext({
  viewOffer: (experiment: string, offerId: number, companyId: number) => Promise.resolve(),
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
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const { OfferDetailsComponent, updateOfferDetailsComponent } =
    useOfferDetailsComponent(platformAdapter);

  const [offerMeta, setOfferMeta] = useState<OfferMeta | undefined>();
  const [offerData, setOfferData] = useState<OfferDetails | undefined>();
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('pending');

  const viewOffer = async (experiment: string, offerId: number) => {
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
        setOfferData(data as OfferDetails);
        setOfferMeta({
          offerId: data.id.toString(),
          companyId: data.companyId.toString(),
          companyName: '',
        });
        setOfferStatus('success');
      }
    }

    await updateOfferDetailsComponent(experiment, offerId);
    setIsOfferOpen(true);
  };

  const onClose = () => {
    setIsOfferOpen(false);
  };

  return (
    <OfferDetailsContext.Provider value={{ viewOffer }}>
      {children}

      <div
        className={`w-full h-full transition-visibility duration-1000 ${
          isOfferOpen ? 'visible' : 'invisible'
        }`}
      >
        <OfferDetailsComponent
          amplitudeEvent={({ event, params }) => {
            platformAdapter.logAnalyticsEvent(event, params);
          }}
          BRAND="blc-uk"
          cdnUrl="https://cdn.bluelightcard.co.uk"
          isMobileHybrid={platformAdapter.platform === PlatformVariant.Mobile}
          isOpen={isOfferOpen}
          offerStatus={offerStatus}
          offerDetails={offerData}
          offerMeta={offerMeta}
          onClose={onClose}
          platform={platformAdapter.platform}
        />
      </div>
    </OfferDetailsContext.Provider>
  );
};
