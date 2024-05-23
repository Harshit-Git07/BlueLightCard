import { Meta } from '@storybook/react';
import OfferTopDetailsHeaderComponent, { Props } from './index';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../../../adapters';
import { PlatformVariant } from '../../../../types';
import { SharedUIConfigProvider } from '../../../../providers';

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
  navigateExternal: () => ({
    isOpen: () => true,
  }),
  writeTextToClipboard: () => Promise.resolve(),
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

const renderTemplate = (args: Partial<Props>) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <SharedUIConfigProvider
      value={{
        globalConfig: {
          brand: 'blc-uk',
          cdnUrl: 'https://cdn.bluelightcard.co.uk',
        },
      }}
    >
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferTopDetailsHeaderComponent {...props} {...args} />
      </PlatformAdapterProvider>
    </SharedUIConfigProvider>
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
