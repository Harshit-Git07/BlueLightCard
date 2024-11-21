import { Context, createContext, FC, useContext } from 'react';
import { useOfferDetailsComponent } from './useOfferDetailsComponent';
import { Amplitude, usePlatformAdapter } from '../../adapters';
import { useAtomValue, useSetAtom } from 'jotai';
import { initializeOfferSheetAtom, offerSheetAtom } from '../OfferSheet/store';
import { PlatformVariant } from '../../types';

type OfferData = {
  offerId: number | string;
  companyId: number | string;
  companyName: string;
  platform: PlatformVariant;
  amplitudeCtx?: Amplitude | null | undefined;
  responsiveWeb?: boolean;
};

type IOfferDetailsContext = {
  viewOffer: (offerData: OfferData) => Promise<void>;
};
export const OfferDetailsContext: Context<IOfferDetailsContext> = createContext({
  viewOffer: (offerData: OfferData) => {
    // [TODO] What is offerData here for? Temp for something later?
    console.log(offerData);
    return Promise.resolve();
  },
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
      amplitudeCtx: offerData.amplitudeCtx,
      responsiveWeb: offerData.responsiveWeb,
    });
    setOfferAtom((prev) => ({ ...prev, isOpen: true, onClose }));
  }

  return (
    <OfferDetailsContext.Provider value={{ viewOffer }}>
      {children}
      <div
        className={`absolute z-50 top-0 w-full h-full transition-visibility duration-1000 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <OfferDetailsComponent />
      </div>
    </OfferDetailsContext.Provider>
  );
};
