import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import type { UserModel } from '@blc-mono/identity/src/models/user';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

interface UserData extends UserModel {
  canRedeemOffer: boolean; //todo remove this when identity update the userModel
}

type UserApiResponse = {
  message: string;
  data: UserData;
};

export interface ICardStatusHelper {
  validateCardStatus(userToken: string): Promise<boolean>;
}

export class CardStatusHelper implements ICardStatusHelper {
  static readonly key = 'CardStatusHelper';
  static readonly inject = [Logger.key] as const;
  private readonly userEndpoint: string;

  constructor(private Logger: ILogger) {
    this.userEndpoint = getEnv(RedemptionsStackEnvironmentKeys.USER_IDENTITY_ENDPOINT);
  }

  async validateCardStatus(userToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.userEndpoint}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        //todo: add zod parsing when "canRedeemOffer" is implemented
        const userData: UserApiResponse = (await response.json()) as UserApiResponse;
        const { message, data } = userData;
        if (!data && message) {
          this.Logger.error({ message: 'Error fetching user data from user identity service', error: message });
          return false;
        }
        if (data?.canRedeemOffer) {
          return data.canRedeemOffer;
        }
      }
      this.Logger.error({ message: 'fetch failed for user api' });
    } catch (error) {
      this.Logger.error({ message: 'Error fetching user data from user identity service' });
      return false;
    }
    return false;
  }
}
