import { Meta, StoryFn } from '@storybook/react';
import SearchResultsPresenter from '@/modules/SearchResults/components/SearchResultsPresenter';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof SearchResultsPresenter> = {
  title: 'Modules/SearchResults',
  component: SearchResultsPresenter,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    results: [
      {
        id: 1,
        offername: 'Test Offer 1',
        companyname: 'Test Company Name 1',
        compid: 2,
        s3logos: 'iceland.png',
        logos: 'iceland.png',
        absoluteLogos: 'iceland.png',
        typeid: 3,
      },
      {
        id: 2,
        offername: 'Test Offer 2',
        companyname: 'Test Company Name 2',
        compid: 3,
        s3logos: 'toolstation.png',
        logos: 'toolstation.png',
        absoluteLogos: 'toolstation.png',
        typeid: 4,
      },
    ],
  },
  argTypes: {
    onOfferClick: { action: 'Offer clicked' },
  },
};

const DefaultTemplate: StoryFn<typeof SearchResultsPresenter> = (args) => {
  return <SearchResultsPresenter {...args} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
