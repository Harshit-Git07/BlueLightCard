import { Decorator } from '@storybook/react';
import UserContext, { UserContextType } from '../UserContext';

export const StorybookUserContextDecorator: Decorator = (Story, { parameters }) => {
  const userContext: UserContextType = {
    dislikes: [],
    error: undefined,
    isAgeGated: false,
    setUser: () => {},
    user: {
      companies_follows: [],
      legacyId: 'mock-legacy-id',
      profile: {
        dob: 'mock-dob',
        organisation: 'mock-organisation',
      },
      uuid: 'mock-uuid',
    },
    ...parameters.userContext?.value,
  };

  return (
    <UserContext.Provider value={userContext}>
      <Story />
    </UserContext.Provider>
  );
};
