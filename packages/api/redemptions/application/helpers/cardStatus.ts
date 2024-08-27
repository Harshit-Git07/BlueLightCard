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
  private readonly identityApiUrl: string;

  constructor(private Logger: ILogger) {
    this.identityApiUrl = getEnv(RedemptionsStackEnvironmentKeys.IDENTITY_API_URL);
  }

  async validateCardStatus(userToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.identityApiUrl}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const {
        data: { canRedeemOffer },
      } = (await response.json()) as UserApiResponse;

      // NOTE: When canRedeemOffer is falsy we log a warning
      !canRedeemOffer && this.Logger.warn({ message: 'Warning User cannot redeem offer' });

      return canRedeemOffer;
    } catch (error) {
      this.Logger.error({ message: 'Error fetching user data from the User Identity Service', error });

      return false;
    }
  }
}
