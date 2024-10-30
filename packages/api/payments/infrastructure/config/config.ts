import { Stack } from 'sst/constructs';

import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND, MAP_BRAND } from '@blc-mono/core/constants/common';
import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv } from '@blc-mono/core/utils/getEnv';

import { PaymentsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX } from '../constants/sst';

export type PaymentsStackConfig = {
  currencyCode: string;
  stripeEventBusArn: string;
  stripeEventSourcePrefix: string;
};

export class PaymentsStackConfigResolver {
  public static for(stack: Stack): PaymentsStackConfig {
    const brand = getBrandFromEnv();
    switch (true) {
      case isProduction(stack.stage):
        return this.forProductionStage()[brand];
      case isStaging(stack.stage):
        return this.forStagingStage()[brand];
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables(stack.stage, MAP_BRAND[brand]);
    }
  }

  public static forProductionStage(): Record<Brand, PaymentsStackConfig> {
    const staticConfig = {
      stripeEventSourcePrefix: 'aws.partner/stripe.com',
    };
    return {
      [BLC_UK_BRAND]: {
        ...staticConfig,
        currencyCode: 'GBP',
        stripeEventBusArn:
          'arn:aws:events:eu-west-2:676719682338:event-bus/aws.partner/stripe.com/ed_61RNBkMtVPI8dQngN16PB075XLE9pY8GiImUkqT68S2y',
      },
      [BLC_AU_BRAND]: {
        ...staticConfig,
        currencyCode: 'AUD',
        stripeEventBusArn:
          'arn:aws:events:ap-southeast-2:676719682338:event-bus/aws.partner/stripe.com/ed_61ROhhIVzYs0946wF16PANAFCi8S6oqsDrldIF09w4Yi',
      },
      [DDS_UK_BRAND]: {
        ...staticConfig,
        currencyCode: 'GBP',
        stripeEventBusArn:
          'arn:aws:events:eu-west-2:676719682338:event-bus/aws.partner/stripe.com/ed_61RNBlZWIas1CUcD416PE3tWQ5E9EJyeug65YV4uuUE4',
      },
    };
  }

  public static forStagingStage(): Record<Brand, PaymentsStackConfig> {
    const staticConfig = {
      stripeEventSourcePrefix: 'aws.partner/stripe.com',
    };
    return {
      [BLC_UK_BRAND]: {
        ...staticConfig,
        currencyCode: 'GBP',
        stripeEventBusArn:
          'arn:aws:events:eu-west-2:314658777488:event-bus/aws.partner/stripe.com/ed_test_61RJx7rBwGcuafnIw16RJaKQXLE9MdjNBOSF4d4I42RM',
      },
      [BLC_AU_BRAND]: {
        ...staticConfig,
        currencyCode: 'AUD',
        stripeEventBusArn:
          'arn:aws:events:ap-southeast-2:314658777488:event-bus/aws.partner/stripe.com/ed_test_61ROhdB8vpukSfP3S16RNBP2Ci8SlYaDlGfEynW3M7ia',
      },
      [DDS_UK_BRAND]: {
        ...staticConfig,
        currencyCode: 'GBP',
        stripeEventBusArn:
          'arn:aws:events:eu-west-2:314658777488:event-bus/aws.partner/stripe.com/ed_test_61RNBa0Z90abKY8kK16RNBSiQ5E98SKWrtKHkuPMuIFM',
      },
    };
  }

  public static forPrStage(): PaymentsStackConfig {
    return {
      stripeEventSourcePrefix: 'aws.partner/stripe.com',
      currencyCode: 'GBP',
      stripeEventBusArn:
        'arn:aws:events:eu-west-2:314658777488:event-bus/aws.partner/stripe.com/ed_test_61RJx7rBwGcuafnIw16RJaKQXLE9MdjNBOSF4d4I42RM',
    };
  }

  public static fromEnvironmentVariables(stage: string, brand: string): PaymentsStackConfig {
    return {
      stripeEventSourcePrefix: 'aws.partner/stripe.com',
      currencyCode: getEnv(PaymentsStackEnvironmentKeys.CURRENCY_CODE),
      stripeEventBusArn: getEnv(PaymentsStackEnvironmentKeys.STRIPE_EVENT_BUS_ARN),
    };
  }
}
