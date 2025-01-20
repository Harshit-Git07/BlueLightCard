import { GetUsersByEmailRequest, PasswordGrantRequest, TokenSet } from 'auth0';
import { logger } from '@blc-mono/members/application/middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  managementApiClient,
  passwordValidationClient,
} from '@blc-mono/members/application/auth0/auth0Clients';

export class Auth0ClientService {
  // TODO: Implement this and then remove the eslint disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changeEmail(memberId: string, newEmail: string): Promise<void> {}

  async changePassword(memberAuth0Id: string, newPassword: string): Promise<void> {
    try {
      await managementApiClient().users.update({ id: memberAuth0Id }, { password: newPassword });
      logger.info('User password updated successfully');
    } catch (error) {
      logger.error('Error updating user password');
    }
  }

  async authenticateUserWithPassword(username: string, password: string): Promise<TokenSet> {
    try {
      const params: PasswordGrantRequest = {
        username: username,
        password: password,
      };
      const tokens = await passwordValidationClient.oauth.passwordGrant(params);

      return tokens.data;
    } catch (error) {
      logger.error({ message: 'Error authenticating member', error });
      throw new ValidationError('Current password is not correct');
    }
  }

  async getUserIdByEmail(email: string): Promise<string> {
    const params: GetUsersByEmailRequest = {
      email: email,
      fields: 'user_id',
      include_fields: true,
    };
    const response = await managementApiClient().usersByEmail.getByEmail(params);

    return response.data[0]['user_id'];
  }
}
