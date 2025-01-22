/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayEvent } from 'aws-lambda';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';

import * as UserDetails from '../utils/getUserDetails';

jest.mock('@blc-mono/core/utils/unpackJWT');

const mockStandardToken: JWT = {
  sub: '123456',
  exp: 9999999999,
  iss: 'https://example.com/',
  iat: 999999999,
  email: 'user@example.com',
  'custom:blc_old_uuid': 'legacy-uuid',
  'custom:blc_old_id': '1234',
};

type UserInHandlerProps = {
  handler: (event: APIGatewayEvent) => Promise<any>;
  event: Partial<APIGatewayEvent>;
  errorMessage: string;
  noOrganisation: {
    responseMessage: string;
    data: any;
  };
};

export function getUserInHandlersSharedTests({ handler, event, errorMessage, noOrganisation }: UserInHandlerProps) {
  const mockEvent = {
    ...event,
    headers: {
      Authorization: 'idToken',
      'x-client-type': 'web',
    },
  };
  describe('getUserInHandlersSharedTests', () => {
    beforeEach(() => {
      jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });
      jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
    });

    it('should return a 500 if an error is thrown in unpacking the Authorisation token', async () => {
      jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => {
        throw new Error('Error');
      });

      const result = await handler(mockEvent as APIGatewayEvent);

      const expectedResponse = Response.Error(new Error(errorMessage), HttpStatusCode.INTERNAL_SERVER_ERROR);

      expect(result).toEqual(expectedResponse);
    });

    it('should return a 401 if no user profile is found', async () => {
      jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue(undefined);

      const result = await handler(mockEvent as APIGatewayEvent);

      const expectedResponse = Response.Unauthorized({
        message: 'User profile not found',
      });

      expect(result).toEqual(expectedResponse);
    });

    it('should return a 200 and the data expected for no organisation assigned', async () => {
      const mockUserDetails = { dob: '2001-01-01', organisation: undefined } as unknown as {
        dob: string;
        organisation: string;
      };
      jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue(mockUserDetails);

      const results = await handler(mockEvent as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: noOrganisation.responseMessage,
        data: noOrganisation.data,
      });

      expect(results).toEqual(expectedResponse);
    });
  });
}
