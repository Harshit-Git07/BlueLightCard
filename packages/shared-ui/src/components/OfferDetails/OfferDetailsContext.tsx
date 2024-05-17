import { Context, FC, createContext, useContext } from 'react';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { Amplitude, usePlatformAdapter } from '../../adapters';
import { useAtomValue, useSetAtom } from 'jotai';
import { initializeOfferSheetAtom, offerSheetAtom } from '../OfferSheet/store';
import { PlatformVariant } from '../../types';

type OfferData = {
  offerId: number;
  companyId: number;
  companyName: string;
  platform: PlatformVariant;
  cdnUrl: string;
  BRAND: string;
  isMobileHybrid: boolean;
  height: string;
  amplitudeCtx?: Amplitude | null | undefined;
};

type IOfferDetailsContext = {
  viewOffer: (offerData: OfferData) => Promise<void>;
};
const OfferDetailsContext: Context<IOfferDetailsContext> = createContext({
  viewOffer: (offerData: OfferData) => Promise.resolve(),
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

  async function viewOffer(offerData: OfferData): Promise<void> {
    const onClose = () => {
      setOfferAtom((prev) => ({ ...prev, isOpen: false }));
      // Delay the reset of the offer details to allow the animation to complete
      setTimeout(() => {
        setTimeout(() => setOfferAtom(initializeOfferSheetAtom()), 300);
      }, 300);
    };

    await updateOfferDetailsComponent({
      offerId: offerData.offerId,
      companyId: offerData.companyId,
      companyName: offerData.companyName,
      platform: offerData.platform,
      cdnUrl: offerData.cdnUrl,
      BRAND: offerData.BRAND,
      isMobileHybrid: offerData.isMobileHybrid,
      height: offerData.height,
      amplitudeCtx: offerData.amplitudeCtx,
    });
    setOfferAtom((prev) => ({ ...prev, isOpen: true, onClose }));
  }

  return (
    <OfferDetailsContext.Provider value={{ viewOffer }}>
      {children}
      <div
        className={`w-full h-full transition-visibility duration-1000 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <OfferDetailsComponent />
      </div>
    </OfferDetailsContext.Provider>
  );
};
