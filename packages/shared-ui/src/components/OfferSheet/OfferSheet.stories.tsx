import { Meta, StoryFn } from '@storybook/react';
import OfferSheet from '.';
import { PlatformVariant } from '../../types';
import { useSetAtom } from 'jotai';
import { offerSheetAtom } from './store';
import { useEffect } from 'react';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../adapters';

const componentMeta: Meta<typeof OfferSheet> = {
  title: 'Component System/Offer Sheet',
  component: OfferSheet,
};

const mockPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () =>
    Promise.resolve({ statusCode: 200, body: "{ data: { redemptionType: 'vault' } }" }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => {},
  writeTextToClipboard: () => Promise.resolve(),
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

const DefaultTemplate: StoryFn<typeof OfferSheet> = (args) => {
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  useEffect(() => {
    setOfferSheetAtom((prev) => ({
      ...prev,
      isOpen: true,
      onClose: () => {},
      platform: PlatformVariant.Web,
      cdnUrl: 'https://cdn.bluelightcard.co.uk',
      isMobileHybrid: false,
      offerMeta: { offerId: 3802, companyId: 4016, companyName: 'SEAT' },
      offerDetails: {
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
    }));
  }, [setOfferSheetAtom]);

  return (
    <div style={{ minHeight: 250 }}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheet {...args} />
      </PlatformAdapterProvider>
    </div>
  );
};

export const PendingStatus = DefaultTemplate.bind({});
PendingStatus.args = {
  offerStatus: 'pending',
};

export const ErrorStatus = DefaultTemplate.bind({});
ErrorStatus.args = {
  offerStatus: 'error',
};

export const SuccessStatus = DefaultTemplate.bind({});
SuccessStatus.args = {
  offerStatus: 'success',
};

export default componentMeta;
