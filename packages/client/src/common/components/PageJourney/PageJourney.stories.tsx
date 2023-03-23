import { ComponentMeta, ComponentStory } from '@storybook/react';
import PageJourney from '@/components/PageJourney/PageJourney';
import PageJourneyContent from './PageJourneyContent';

const componentMeta: ComponentMeta<typeof PageJourney> = {
  title: 'Component System/PageJourney',
  component: PageJourney,
  argTypes: {
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
  FinishComponent: () => <h2>Finish Component</h2>,
};

const PageJourneyTemplate: ComponentStory<typeof PageJourney> = (args) => (
  <PageJourney {...args}>
    <PageJourneyContent components={components} />
  </PageJourney>
);

export const Default = PageJourneyTemplate.bind({});

Default.args = {
  tabs: [
    {
      id: 'pageJourneyTab1',
      label: 'Tab One',
      complete: true,
      contentBlocks: [
        {
          id: 'pageJourneyTab1Content1',
          componentKey: 'AboutComponent',
        },
        {
          id: 'pageJourneyTab1Content2',
          componentKey: 'AddressComponent',
        },
        {
          id: 'pageJourneyTab1Content3',
          componentKey: 'FinishComponent',
        },
      ],
    },
    {
      id: 'pageJourneyTab2',
      label: 'Tab Two',
      contentBlocks: [
        {
          id: 'pageJourneyTab2Content1',
          componentKey: 'AddressComponent',
          marker: true,
          current: true,
        },
        {
          id: 'pageJourneyTab2Content2',
          componentKey: 'AboutComponent',
        },
      ],
    },
    {
      id: 'pageJourneyTab3',
      label: 'Tab Three',
      contentBlocks: [],
    },
  ],
};

export default componentMeta;
