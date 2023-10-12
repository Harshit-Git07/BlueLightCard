import type { Meta, StoryFn } from '@storybook/react';

import Headerbar from './Headerbar';

const meta: Meta<typeof Headerbar> = {
  title: 'member-services-hub/Headerbar',
  component: Headerbar,
  argTypes: {
    firstname: { description: 'First name of the person' },
    surname: { description: 'Second Name of the person' },
    email: { description: 'Email of the person' },
    profilePicture: {
      description: 'A link to their profile picture, if not passed will set to initials',
    },
    button: { description: 'A button to be implemented later' },
    buttonText: { description: 'Text of the button' },
    rightChevron: { description: 'The chevron on the right of profile picture' },
    leftChevron: { description: 'The chevron on the left of profile picture' },
    notifications: { description: 'The notification icon' },
    messages: { description: 'The messages icon' },
    calender: { description: 'The calender icon' },
    welcome: { description: 'A flag for welcome message' },
    welcomeHeader: { description: 'The welcome message heading' },
    welcomeText: { description: 'The welcome message text' },
    search: { description: 'A search bar to be implemented later' },
  },
};

const HeaderbarTemplate: StoryFn<typeof Headerbar> = (args) => <Headerbar {...args} />;

export const Default = HeaderbarTemplate.bind({});

Default.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
};

export const EverythingOn = HeaderbarTemplate.bind({});

EverythingOn.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
  button: true,
  buttonText: 'buttonText',
  rightChevron: true,
  leftChevron: true,
  notifications: true,
  messages: true,
  calender: true,
  welcome: true,
  welcomeHeader: 'Welcome Message!',
  welcomeText: 'Welcome to the new admin panel!',
  search: true,
};

export const WelcomeSearch = HeaderbarTemplate.bind({});

WelcomeSearch.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
  welcome: true,
  welcomeHeader: 'Welcome Message!',
  welcomeText: 'Welcome to the new admin panel!',
  search: true,
};

export const Icons = HeaderbarTemplate.bind({});

Icons.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
  notifications: true,
  messages: true,
  calender: true,
};

export const AvatarSet = HeaderbarTemplate.bind({});

AvatarSet.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
};

export const AvatarNotSet = HeaderbarTemplate.bind({});

AvatarNotSet.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
};

export default meta;
