import { render, waitFor } from '@testing-library/react';
import UserProvider from '@/context/User/UserProvider';
import AuthContext from '@/context/Auth/AuthContext';
import axios from 'axios';
import { FC, useContext } from 'react';
import { User } from '@/context/User/UserContext';
import UserContext from '@/context/User/UserContext';
import { screen } from '@testing-library/dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('User Provider', () => {
  it('should retrieve user when user is found', async () => {
    const expectedUser: User = {
      profile: {
        dob: '1998-04-02',
        organisation: 'DEN',
      },
      companies_follows: [{ companyId: '123', likeType: 'abc' }],
      uuid: '123',
      legacyId: '456',
    };
    givenUserExists();

    whenComponentIsRendered();

    await thenUserShouldBeRetrieved(expectedUser);
  });

  it('should store error when error occurs', async () => {
    givenUserRequestFails();

    whenComponentIsRendered();

    await thenErrorShouldBeStored('An unknown error occurred');
  });
});

const givenUserExists = () => {
  mockedAxios.request.mockResolvedValue({
    data: {
      data: buildUserFromAPI(),
    },
  });
};

const givenUserRequestFails = () => mockedAxios.request.mockRejectedValueOnce(new Error('Error'));

const whenComponentIsRendered = () => {
  render(
    <AuthContext.Provider
      value={{
        authState: {
          accessToken: '',
          idToken: '',
        },
        updateAuthTokens: jest.fn(),
        isUserAuthenticated: jest.fn(),
        isReady: true,
      }}
    >
      <UserProvider>
        <TestUserProviderConsumer />
      </UserProvider>
    </AuthContext.Provider>
  );
};

const thenUserShouldBeRetrieved = async (expectedUser: User) => {
  await waitFor(() => expect(screen.getByText(JSON.stringify(expectedUser))).toBeTruthy());
};

const thenErrorShouldBeStored = async (statusMessage: string) => {
  await waitFor(() => expect(screen.getByText(statusMessage)).toBeTruthy());
};

const TestUserProviderConsumer: FC = () => {
  const { user, error } = useContext(UserContext);
  if (error) {
    return <>{error}</>;
  }
  return <>{JSON.stringify(user)}</>;
};

const buildUserFromAPI = () => {
  return {
    profile: {
      firstname: 'John',
      surname: 'Smith',
      organisation: 'DEN',
      dob: '1998-04-02',
      gender: 'M',
      mobile: '+47772345678',
      uuid: '123',
      service: '',
      spareEmail: '',
      spareEmailValidated: 0,
      twoFactorAuthentication: false,
    },
    cards: {
      cardId: '123456',
      expires: '1706613799',
      cardPrefix: '',
      cardStatus: 'PHYSICAL_CARD',
      datePosted: null,
    },
    companies_follows: [
      {
        companyId: '123',
        likeType: 'abc',
      },
    ],
    uuid: '123',
    legacyId: '456',
  };
};
