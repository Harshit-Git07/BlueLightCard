import { Meta, StoryFn } from '@storybook/react';
import OfferSheet from './offer-sheet';
import { PlatformAdapterProvider } from '../../adapters';
import { SharedUIConfigProvider } from '../../providers/SharedUiConfigProvider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Drawer } from '../Drawer';
import Button from '../Button';
import { getMockPlatformAdapter } from './__mocks__/platformAdapter';
import { RedemptionType } from '../../utils/redemptionTypes';

const componentMeta: Meta = {
  title: 'Component System/OfferSheet2',
  argTypes: {
    redemptionType: {
      control: 'select',
      options: [
        RedemptionType.VAULT,
        RedemptionType.VAULT_QR,
        RedemptionType.GENERIC,
        RedemptionType.PRE_APPLIED,
        RedemptionType.SHOW_CARD,
        'error',
      ],
    },
  },
};

const mockQueryClient = new QueryClient();

type OfferSheetProps = {
  redemptionType:
    | RedemptionType.VAULT
    | RedemptionType.VAULT_QR
    | RedemptionType.GENERIC
    | RedemptionType.PRE_APPLIED
    | RedemptionType.SHOW_CARD
    | 'error';
};

const OfferSheet2Template: StoryFn<OfferSheetProps> = (args) => (
  <SharedUIConfigProvider
    value={{
      globalConfig: {
        brand: 'blc-uk',
        cdnUrl: 'https://cdn.bluelightcard.co.uk',
      },
    }}
  >
    <QueryClientProvider client={mockQueryClient}>
      <PlatformAdapterProvider adapter={getMockPlatformAdapter(args.redemptionType)}>
        <Drawer
          drawer={OfferSheet}
          companyId={123}
          companyName="Example Offer"
          offerId={123}
          amplitude={undefined}
        >
          <div>
            <p>
              The page might need a refresh if the offer sheet has already been opened and a change
              has been made to the redemptionType.
            </p>
            <Button>Open Offer Sheet</Button>
          </div>
        </Drawer>
      </PlatformAdapterProvider>
    </QueryClientProvider>
  </SharedUIConfigProvider>
);

export const OfferSheetStory = OfferSheet2Template.bind({});
OfferSheetStory.args = {
  redemptionType: RedemptionType.VAULT,
};

export const FailedOffer = OfferSheet2Template.bind({});
FailedOffer.args = {
  redemptionType: 'error',
};

export default componentMeta;
