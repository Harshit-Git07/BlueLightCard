import { Meta } from '@storybook/react';
import OfferTopDetailsHeaderComponent, { Props } from './index';
import { IPlatformAdapter, PlatformAdapterProvider } from 'src/adapters';
import { PlatformVariant } from 'src/types';

const props: Props = {
  showOfferDescription: true,
  showShareFavorite: true,
  showTerms: true,
  showExclusions: true,
};

const meta: Meta<typeof OfferTopDetailsHeaderComponent> = {
  title: 'Component System/Offer Sheet/Offer Top Details Header',
  component: OfferTopDetailsHeaderComponent,
  args: props,
  parameters: {
    layout: 'centered',
  },
};

const mockPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () =>
    Promise.resolve({ status: 200, data: "{ data: { redemptionType: 'vault' } }" }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => {},
  endpoints: {
    REDEMPTION_DETAILS: '/eu/redemptions/member/redemptionDetails',
    REDEEM_OFFER: '/eu/redemptions/member/redeem',
    OFFER_DETAILS: '/eu/offers/offers',
  },
  writeTextToClipboard: () => Promise.resolve(),
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

const renderTemplate = (args: Partial<Props>) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <OfferTopDetailsHeaderComponent {...props} {...args} />
    </PlatformAdapterProvider>
  </div>
);

export const ShowOrHideSections = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: true,
    showTerms: true,
  });

export const DescriptionSeeMore = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: false,
    showTerms: false,
  });

export default meta;
