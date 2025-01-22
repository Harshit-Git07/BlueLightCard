import { Stack } from 'sst/constructs';

import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from '@blc-mono/core/constants/common';
import { Brand, CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';
import {
  productionDomainNames as paymentsProdDomains,
  stagingDomainNames as paymentsStagingDomains,
} from '@blc-mono/payments/infrastructure/constants/domains';

import { OrdersStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX } from '../constants/sst';

type NetworkConfig = {
  apiDefaultAllowedOrigins: string[];
  ordersWebHost: string;
  identityApiUrl: string;
  paymentsApiUrl: string;
};

type email = {
  brazeApiUrl: string;
  brazePaymentSucceededEmailCampaignId: string;
};

export type OrdersStackConfig = {
  // This should be in smallest currency unit (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency)
  membershipPrice: string;
  networkConfig: NetworkConfig;
  currencyCode: string;
  emailConfig: email;
};

const brazeApiUrl = 'https://rest.fra-02.braze.eu';

export class OrdersStackConfigResolver {
  public static for(stack: Stack): OrdersStackConfig {
    const brand = getBrandFromEnv();
    switch (true) {
      case isProduction(stack.stage):
        return this.forProductionStage()[brand];
      case isStaging(stack.stage):
        return this.forStagingStage()[brand];
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionStage(): Record<Brand, OrdersStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'gbp',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.bluelightcard.co.uk'],
          ordersWebHost: 'https://www.bluelightcard.co.uk',
          identityApiUrl: 'https://identity.blcshine.io',
          paymentsApiUrl: `https://${paymentsProdDomains.BLC_UK}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
        },
      },
      [BLC_AU_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'aud',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au'],
          ordersWebHost: 'https://www.bluelightcard.com.au',
          identityApiUrl: 'https://identity-au.blcshine.io',
          paymentsApiUrl: `https://${paymentsProdDomains.BLC_AU}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
        },
      },
      [DDS_UK_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'gbp',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.defencediscountservice.co.uk'],
          ordersWebHost: 'https://www.defencediscountservice.co.uk',
          identityApiUrl: 'https://identity.blcshine.io',
          paymentsApiUrl: `https://${paymentsProdDomains.DDS_UK}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
        },
      },
    };
  }

  public static forStagingStage(): Record<Brand, OrdersStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'gbp',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.staging.bluelightcard.co.uk', 'http://localhost:3000'],
          ordersWebHost: 'https://staging.bluelightcard.co.uk',
          identityApiUrl: 'https://staging-identity.blcshine.io',
          paymentsApiUrl: `https://${paymentsStagingDomains.BLC_UK}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'a28c2e99-2192-4c3d-ad7b-63b6a8af7b27',
        },
      },
      [BLC_AU_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'aud',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.develop.bluelightcard.com.au', 'http://localhost:3000'],
          ordersWebHost: 'https://www.develop.bluelightcard.com.au',
          identityApiUrl: 'https://staging-identity-au.blcshine.io',
          paymentsApiUrl: `https://${paymentsStagingDomains.BLC_AU}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
        },
      },
      [DDS_UK_BRAND]: {
        membershipPrice: '499',
        currencyCode: 'gbp',
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.ddsstaging.bluelightcard.tech', 'http://localhost:3000'],
          ordersWebHost: 'https://www.ddsstaging.bluelightcard.tech',
          identityApiUrl: 'https://staging-identity.blcshine.io',
          paymentsApiUrl: `https://${paymentsStagingDomains.DDS_UK}`,
        },
        emailConfig: {
          brazeApiUrl: brazeApiUrl,
          brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
        },
      },
    };
  }

  public static forPrStage(): OrdersStackConfig {
    return {
      membershipPrice: '499',
      currencyCode: 'gbp',
      networkConfig: {
        apiDefaultAllowedOrigins: ['*'],
        ordersWebHost: 'https://staging.bluelightcard.co.uk',
        identityApiUrl: 'https://staging-identity.blcshine.io',
        paymentsApiUrl: `https://${paymentsStagingDomains.DDS_UK}`,
      },
      emailConfig: {
        brazeApiUrl: brazeApiUrl,
        brazePaymentSucceededEmailCampaignId: 'brazePaymentSucceededEmailCampaignId',
      },
    };
  }

  public static fromEnvironmentVariables(): OrdersStackConfig {
    return {
      membershipPrice: getEnv(OrdersStackEnvironmentKeys.MEMBERSHIP_PRICE),
      currencyCode: getEnv(OrdersStackEnvironmentKeys.CURRENCY_CODE),
      networkConfig: {
        apiDefaultAllowedOrigins: getEnvValidated(
          OrdersStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
          JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
        ),
        ordersWebHost: getEnv(OrdersStackEnvironmentKeys.ORDERS_WEB_HOST),
        identityApiUrl: getEnv(OrdersStackEnvironmentKeys.IDENTITY_API_URL),
        paymentsApiUrl: getEnv(OrdersStackEnvironmentKeys.PAYMENTS_API_URL),
      },
      emailConfig: {
        brazeApiUrl: getEnv(OrdersStackEnvironmentKeys.BRAZE_API_URL),
        brazePaymentSucceededEmailCampaignId: getEnv(
          OrdersStackEnvironmentKeys.BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID,
        ),
      },
    };
  }
}
