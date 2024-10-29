import { HTTPRequestMethods } from '@blc-mono/core/utils/fetch/httpRequest';
import { signAndHandleRequest } from '@blc-mono/core/utils/fetch/signedHttpRequest';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { OrdersStackEnvironmentKeys } from '@blc-mono/orders/infrastructure/constants/environment';

import { UserContext } from '../../controllers/apiGateway/checkout/CheckoutController';
import { PostCheckoutModel } from '../../models/postCheckout';

export type CheckoutResult = {
  clientSecret: string;
  ephemeralKey: string;
  externalCustomer: string;
  publishableKey: string;
};

export interface ICheckoutService {
  checkout(checkoutBasket: PostCheckoutModel, userContext: UserContext): Promise<CheckoutResult>;
}

export class CheckoutService implements ICheckoutService {
  static readonly key = 'CheckoutService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public async checkout(checkoutBasket: PostCheckoutModel, userContext: UserContext): Promise<CheckoutResult> {
    const metadata = checkoutBasket.items[0].metadata;

    const response = await signAndHandleRequest(
      `${getEnv(OrdersStackEnvironmentKeys.PAYMENTS_API_URL)}/payment-intiation`,
      {
        idempotencyKey: checkoutBasket.idempotencyKey,
        user: userContext,
        amount: Number(getEnv(OrdersStackEnvironmentKeys.MEMBERSHIP_PRICE)),
        metadata: metadata,
        description: checkoutBasket.description,
      },
      HTTPRequestMethods.POST,
    );

    const responseData = response.data.data;

    return {
      clientSecret: responseData.clientSecret,
      publishableKey: responseData.publishableKey,
      ephemeralKey: responseData.ephemeralKey,
      externalCustomer: responseData.externalCustomer,
    };
  }
}
