import { HTTPRequestMethods } from '@blc-mono/core/utils/fetch/httpRequest';
import { signAndHandleRequest } from '@blc-mono/core/utils/fetch/signedHttpRequest';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { OrdersStackEnvironmentKeys } from '@blc-mono/orders/infrastructure/constants/environment';

import { PostCheckoutModel } from '../../models/postCheckout';

export type CheckoutResult = {
  clientSecret: string;
  ephemeralKey: string;
  customerId: string;
  publishableKey: string;
};

export interface ICheckoutService {
  checkout(checkoutBasket: PostCheckoutModel, memberId: string): Promise<CheckoutResult>;
}

export class CheckoutService implements ICheckoutService {
  static readonly key = 'CheckoutService';
  static readonly inject = [
    Logger.key,
    // TODO: price repository...
  ] as const;

  constructor(private readonly logger: ILogger) {}

  public async checkout(checkoutBasket: PostCheckoutModel, memberId: string): Promise<CheckoutResult> {
    const metadata = checkoutBasket.items[0].metadata;

    // arguably you want to check the product is a membership and if so, set the memberId to the metadata or you always want to set memeberId to the metadata
    metadata['memberId'] = memberId;

    //TODO: get price from config
    //TODO: get endpoint from config...?
    const response = await signAndHandleRequest(
      `${getEnv(OrdersStackEnvironmentKeys.PAYMENTS_API_URL)}/payment-intiation`,
      {
        idempotencyKey: checkoutBasket.idempotencyKey,
        amount: 499, //TODO: the amount should be decided based on itemn in payload
        metadata: metadata,
      },
      HTTPRequestMethods.POST,
    );

    const responseData = response.data.data;

    return {
      clientSecret: responseData.clientSecret,
      publishableKey: responseData.publishableKey,
      ephemeralKey: '',
      customerId: '',
    };
  }
}
