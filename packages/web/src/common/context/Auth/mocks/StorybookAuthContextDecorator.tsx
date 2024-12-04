import { Decorator } from '@storybook/react';
import AuthContext, { AuthContextType } from '../AuthContext';

export const StorybookAuthContextDecorator: Decorator = (Story, { parameters }) => {
  const authContext: Partial<AuthContextType> = {
    authState: {
      idToken: '23123',
      accessToken: '111',
      refreshToken: '543',
      username: 'test',
    },
    isUserAuthenticated: () => true,
    isReady: true,
    ...parameters.authContext?.value,
  };

  return (
    <AuthContext.Provider value={authContext as AuthContextType}>
      <Story />
    </AuthContext.Provider>
  );
};
