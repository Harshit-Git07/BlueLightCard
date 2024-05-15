import { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { ViewOfferProvider, useOfferDetails } from './OfferDetailsContext';
import { StorybookPlatformAdapterDecorator } from '../../adapters/StorybookPlatformAdapter';

const invokeV5Api = (path: string) => {
  if (path.includes('/offers/')) {
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify({
        data: {
          id: 1,
          companyId: 2,
          companyName: 'test-company-name',
          companyLogo: 'company-logo.png',
          description: 'A Test Company description',
          expiry: '2024-01-01',
          name: 'Test Company',
          terms: 'Some test terms and conditions',
          type: 'some-offer-type',
        },
      }),
    });
  }

  if (path.includes('/redemptions/')) {
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify({ data: { redemptionType: 'vault' } }),
    });
  }

  return Promise.resolve({ statusCode: 200, body: '{}' });
};

const componentMeta: Meta<typeof ViewOfferProvider> = {
  title: 'Component System/View Offer Provider',
  component: ViewOfferProvider,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    platformAdapter: {
      invokeV5Api,
    },
  },
};

const ViewOfferChild = () => {
  const { viewOffer } = useOfferDetails();

  const onClick = () => {
    viewOffer(1, 2, 'test-company');
  };

  return <button onClick={onClick}>View Offer</button>;
};

const DefaultTemplate: StoryFn<typeof ViewOfferProvider> = (args) => {
  return (
    <div style={{ minHeight: 250 }}>
      <ViewOfferProvider>
        <ViewOfferChild />
      </ViewOfferProvider>
    </div>
  );
};

export const View = DefaultTemplate.bind({});

export const ShowOfferSheet = DefaultTemplate.bind({});
ShowOfferSheet.parameters = {
  platformAdapter: {
    invokeV5Api,
    getAmplitudeFeatureFlag: () => 'treatment',
  },
};
ShowOfferSheet.play = async ({ canvasElement }) => {
  const screen = within(canvasElement);
  screen.getByText('View Offer').click();
};

export const ShowOfferLink = DefaultTemplate.bind({});
ShowOfferLink.parameters = {
  platformAdapter: {
    invokeV5Api,
    getAmplitudeFeatureFlag: () => 'control',
  },
};
ShowOfferLink.play = async ({ canvasElement }) => {
  const screen = within(canvasElement);

  screen.getByText('View Offer').click();
};

export default componentMeta;
