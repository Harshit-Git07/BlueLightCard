import { ComponentMeta, ComponentStory } from '@storybook/react';
import PageJourney from '@/components/PageJourney/PageJourney';

const componentMeta: ComponentMeta<typeof PageJourney> = {
  title: 'Component System/PageJourney',
  component: PageJourney,
  argTypes: {
    tabs: {
      table: {
        disable: true,
      },
    },
  },
};

const PageJourneyTemplate: ComponentStory<typeof PageJourney> = (args) => (
  <PageJourney {...args}>
    <h2>Contained children</h2>
  </PageJourney>
);

export const Default = PageJourneyTemplate.bind({});

Default.args = {
  tabs: [
    {
      id: 'pageJourneyTab1',
      label: 'Tab One',
      progress: 30,
    },
    {
      id: 'pageJourneyTab2',
      label: 'Tab Two',
    },
    {
      id: 'pageJourneyTab3',
      label: 'Tab Three',
    },
  ],
};

export default componentMeta;
