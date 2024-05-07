import { Context, FC, createContext, useContext, useState } from 'react';
import { PlatformVariant } from '../../types';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { usePlatformAdapter } from '../../adapters';

// TODO: Remove offer mocks when Offers V5 API calls have been implemented into OfferSheet
const mockedOfferDetails: any = {
  status: 'success',
  data: {
    companyId: 4016,
    companyLogo: 'companyimages/complarge/retina/',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    expiry: '2030-06-30T23:59:59.000Z',
    id: 3802,
    name: 'Save with SEAT',
    terms: 'Must be a Blue Light Card member in order to receive the discount.',
    type: 'Online',
  },
};
const mockedOfferToDisplay: any = {
  offerId: 3802,
  companyId: 4016,
  companyName: 'SEAT',
};

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

export const ViewOfferProvider: FC<ViewOfferProviderProps> = ({ children }) => {
  const [offerDetails, setOfferDetails] = useState(mockedOfferDetails);
  const [offerMeta, setOfferMeta] = useState(mockedOfferToDisplay);

  const platformAdapter = usePlatformAdapter();
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const { OfferDetailsComponent, updateOfferDetailsComponent } =
    useOfferDetailsComponent(platformAdapter);

  const viewOffer = async (experiment: string, offerId: number, companyId: number) => {
    await updateOfferDetailsComponent(experiment, offerId);

    setOfferDetails({
      ...mockedOfferDetails,
      data: { ...mockedOfferDetails.data, companyId, id: offerId },
    });
    setOfferMeta({ ...mockedOfferToDisplay, companyId, offerId });
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
          offerStatus={offerDetails.status}
          offerDetails={offerDetails.data}
          offerMeta={offerMeta}
          onClose={onClose}
          platform={platformAdapter.platform}
        />
      </div>
    </OfferDetailsContext.Provider>
  );
};
