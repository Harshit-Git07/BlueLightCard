import { Meta } from '@storybook/react';
import { GenericVaultOrPreAppliedPage } from './GenericVaultOrPreAppliedPage';
import { Props } from 'src/components/OfferSheet/components/RedemptionPage/RedemptionPage';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../../../../adapters';
import { PlatformVariant } from '../../../../../types';

const mockPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () =>
    Promise.resolve({ status: 200, data: "{ data: { redemptionType: 'vault' } }" }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => ({ isOpen: () => true }),
  endpoints: {
    REDEMPTION_DETAILS: '/eu/redemptions/member/redemptionDetails',
    REDEEM_OFFER: '/eu/redemptions/member/redeem',
    OFFER_DETAILS: '/eu/offers/offers',
  },
  writeTextToClipboard: () => Promise.resolve(),
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

const props: Props = {
  showExclusions: true,
  showOfferDescription: true,
  showShareFavorite: true,
  showTerms: true,
  state: 'success',
  redemptionType: 'generic',
  redeemData: {
    data: {
      redemptionType: 'generic',
      redemptionDetails: {
        url: 'https://www.example.com',
        code: 'EXAMPLE',
      },
    },
    statusCode: 200,
  },
};

const meta: Meta = {
  title: 'Component System/Offer Sheet/Redemption Page/Generic Vault or PreApplied',
  component: GenericVaultOrPreAppliedPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Success = () => {
  return (
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <GenericVaultOrPreAppliedPage {...props} state="success" />
    </PlatformAdapterProvider>
  );
};

export const Loading = () => {
  return (
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <GenericVaultOrPreAppliedPage {...props} state="loading" />
    </PlatformAdapterProvider>
  );
};

export const Error = () => {
  return (
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <GenericVaultOrPreAppliedPage {...props} state="error" />
    </PlatformAdapterProvider>
  );
};

export default meta;
