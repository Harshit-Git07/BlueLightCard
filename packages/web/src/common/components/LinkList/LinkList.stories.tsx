import { Meta, StoryFn } from '@storybook/react';
import LinkList from './LinkList';
import { LinkItem } from './types';

const componentMeta: Meta = {
  title: 'Component System/LinkList',
  component: LinkList,
  argTypes: {
    numberOflinks: {
      name: 'Number Of Links',
      control: {
        type: 'range',
        min: 2,
        max: 10,
        step: 1,
      },
    },
    linkOneLabel: {
      name: 'Link One Label',
      control: 'text',
    },
    linkOneUrl: {
      name: 'Link One URL',
      control: 'text',
    },
    linkTwoLabel: {
      name: 'Link Two Label',
      control: 'text',
    },
    linkTwoUrl: {
      name: 'Link Two URL',
      control: 'text',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This component is used within the Header NavBar. Styling can be passed to create it in a container and attach to a trigger. See dropdown of NavBar as an example',
      },
    },
    controls: {
      exclude: ['items', 'styling'],
    },
  },
};

const DefaultTemplate: StoryFn = ({
  numberOflinks,
  linkOneLabel,
  linkOneUrl,
  linkTwoLabel,
  linkTwoUrl,
}) => {
  const items: LinkItem[] = [
    {
      id: 'linkOne',
      label: linkOneLabel,
      url: linkOneUrl,
      onClick: () => alert('link one clicked'),
    },
    {
      id: 'linkTwo',
      label: linkTwoLabel,
      url: linkTwoUrl,
      onClick: () => alert('link two clicked'),
    },
  ];
  for (let index = 0; index < numberOflinks - 2; index++) {
    items.push({
      id: `link-${index + 3}`,
      label: `link ${index + 3}`,
      url: `/link-${index + 3}-url`,
      onClick: () => alert(`link ${index + 3} clicked`),
    });
  }

  return <LinkList items={items} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  numberOflinks: 2,
  linkOneLabel: 'link 1',
  linkOneUrl: 'https://www.google.com',
  linkTwoLabel: 'link 2',
  linkTwoUrl: 'https://bluelightcard.co.uk',
};

export default componentMeta;
