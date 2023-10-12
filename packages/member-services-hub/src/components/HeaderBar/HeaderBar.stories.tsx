import type { Meta, StoryFn } from '@storybook/react';

import HeaderBar from './HeaderBar';

const meta: Meta<typeof HeaderBar> = {
  title: 'member-services-hub/HeaderBar',
  component: HeaderBar,
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

const HeaderBarTemplate: StoryFn<typeof HeaderBar> = (args) => <HeaderBar {...args} />;

export const Default = HeaderBarTemplate.bind({});

Default.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
};

export const EverythingOn = HeaderBarTemplate.bind({});

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

export const WelcomeSearch = HeaderBarTemplate.bind({});

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

export const Icons = HeaderBarTemplate.bind({});

Icons.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
  notifications: true,
  messages: true,
  calender: true,
};

export const AvatarSet = HeaderBarTemplate.bind({});

AvatarSet.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
  profilePicture: 'https://cdn.tailgrids.com/2.0/image/assets/images/avatar/image-02.jpg',
};

export const AvatarNotSet = HeaderBarTemplate.bind({});

AvatarNotSet.args = {
  firstname: 'Daniel',
  surname: 'Cook',
  email: 'danielcook@bluelightcard.co.uk',
};

export default meta;
