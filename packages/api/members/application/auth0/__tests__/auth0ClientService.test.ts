import { Auth0ClientService } from '../auth0ClientService';
import { managementApiClient } from '@blc-mono/members/application/auth0/auth0Clients';
import { UsersManager } from 'auth0/dist/cjs/management/__generated/managers/users-manager';
import { ManagementClient } from 'auth0';
import type { UserCreate } from 'auth0/dist/cjs/management/__generated/models';
import { AdminCreateProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';

jest.mock('@blc-mono/members/application/auth0/auth0Clients');
jest.mock('@blc-mono/core/utils/checkBrand');

const managementApiClientMock = jest.mocked(managementApiClient);
const isDdsUkBrandMock = jest.mocked(isDdsUkBrand);
const createMock = jest.fn();

const memberId = 'member id stub';
const profileToCreate: AdminCreateProfileModel = {
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
};
const expectedCreatedUser: UserCreate = {
  email: 'email',
  email_verified: false,
  verify_email: true,
  password: 'password',
  given_name: 'firstName',
  family_name: 'lastName',
  user_id: memberId,
  user_metadata: {
    dateOfBirth: 'dateOfBirth',
  },
  app_metadata: {
    memberUuid: memberId,
  },
  connection: 'Username-Password-Authentication',
};

const target = new Auth0ClientService();

beforeEach(() => {
  managementApiClientMock.mockReturnValue({
    users: {
      create: createMock,
    } as unknown as UsersManager,
  } as unknown as ManagementClient);
});

describe('given creating a user on auth0', () => {
  describe('when brand is not DDS', () => {
    beforeEach(() => {
      isDdsUkBrandMock.mockReturnValue(false);
    });

    it('should create user on auth0 with status of "confirmed"', () => {
      target.createUser(memberId, profileToCreate);

      expect(createMock).toHaveBeenCalledWith(<UserCreate>{
        ...expectedCreatedUser,
        app_metadata: {
          ...expectedCreatedUser.app_metadata,
          status: 'confirmed',
        },
      });
    });
  });

  describe('when brand is DDS', () => {
    beforeEach(() => {
      isDdsUkBrandMock.mockReturnValue(true);
    });

    it('should create user on auth0 with status of "confirmed"', () => {
      target.createUser(memberId, profileToCreate);

      expect(createMock).toHaveBeenCalledWith(<UserCreate>{
        ...expectedCreatedUser,
        app_metadata: {
          ...expectedCreatedUser.app_metadata,
          status: 'default',
        },
      });
    });
  });
});
