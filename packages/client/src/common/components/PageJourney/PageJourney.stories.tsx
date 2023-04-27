import { Meta, StoryFn } from '@storybook/react';
import PageJourney from '@/components/PageJourney/PageJourney';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const componentMeta: Meta<typeof PageJourney> = {
  title: 'Component System/PageJourney',
  component: PageJourney,
  argTypes: {
    mobileHeaderStartSlot: {
      table: {
        disable: true,
      },
    },
    mobileHeaderEndSlot: {
      table: {
        disable: true,
      },
    },
    tabs: {
      table: {
        disable: false,
      },
    },
  },
};

const components = {
  AboutComponent: () => <h2>About Component</h2>,
  AddressComponent: () => <h2>Address Component</h2>,
};

const PageJourneyTemplate: StoryFn<typeof PageJourney> = (args) => (
  <PageJourney
    {...args}
    mobileHeaderStartSlot={
      <button>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    }
  >
    <PageJourney.PageJourneyContent components={components} />
  </PageJourney>
);

export const Default = PageJourneyTemplate.bind({});

Default.args = {
  tabs: [
    {
      id: 'pageJourneyTab1',
      label: 'Tab One',
      complete: true,
      steps: [
        {
          id: 'pageJourneyTab1Step1',
          componentKey: 'AboutComponent',
        },
        {
          id: 'pageJourneyTab1Step2',
          componentKey: 'AddressComponent',
        },
      ],
    },
    {
      id: 'pageJourneyTab2',
      label: 'Tab Two',
      steps: [
        {
          id: 'pageJourneyTab2Step1',
          componentKey: 'AddressComponent',
          marker: true,
          current: true,
        },
        {
          id: 'pageJourneyTab2Step2',
          componentKey: 'AboutComponent',
        },
      ],
    },
    {
      id: 'pageJourneyTab3',
      label: 'Tab Three',
      steps: [],
    },
  ],
};

export default componentMeta;
