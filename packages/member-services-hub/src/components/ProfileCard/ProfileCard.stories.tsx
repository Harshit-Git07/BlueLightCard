//storybook file for ProfileCard component
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import ProfileCard from './ProfileCard';
import { ProfileCardProps } from './types';

const componentMeta: Meta<ProfileCardProps> = {
  title: 'member-services-hub/ProfileCard',
  component: ProfileCard,
};
export default componentMeta;

const Template: StoryFn<ProfileCardProps> = (args: any) => <ProfileCard {...args} />;
export const Default = Template.bind({});
Default.args = {
  user_name: 'Joe Bloggs',
  user_ms_role: 'Manager',
  data_pairs: [
    {
      label: 'Email',
      value: 'joebloggs@abc.co.uk',
    },
    {
      label: 'password',
      value: '***********',
    },
  ],
  user_image: '/assets/placeholder106.png',
};
