import { Meta, StoryFn } from '@storybook/react';
import TextListItem from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/pro-solid-svg-icons';

const componentMeta: Meta<typeof TextListItem> = {
  title: 'Component System/TextListItem',
  component: TextListItem,
  argTypes: {},
};

const TextListItemTemplate: StoryFn<typeof TextListItem> = (args) => <TextListItem {...args} />;

export const Default = TextListItemTemplate.bind({});

Default.args = {
  text: 'Offers near you',
};

export const DefaultWithIcon = TextListItemTemplate.bind({});

DefaultWithIcon.args = {
  text: 'Offers near you',
  icon: <FontAwesomeIcon icon={faLocationDot} size="lg" />,
};

export const Clickable = TextListItemTemplate.bind({});

Clickable.args = {
  text: 'Offers near you',
  variant: 'clickable',
};

export const ClickableWithIcon = TextListItemTemplate.bind({});

ClickableWithIcon.args = {
  text: 'Offers near you',
  icon: <FontAwesomeIcon icon={faLocationDot} size="lg" />,
  variant: 'clickable',
};

export default componentMeta;
