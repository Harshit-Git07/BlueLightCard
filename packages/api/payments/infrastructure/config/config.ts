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
    return {
      [BLC_UK_BRAND]: {
        currencyCode: 'GBP',
      },
      [BLC_AU_BRAND]: {
        currencyCode: 'AUD',
      },
      [DDS_UK_BRAND]: {
        currencyCode: 'GBP',
      },
    };
  }

  public static forStagingStage(): Record<Brand, PaymentsStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        currencyCode: 'GBP',
      },
      [BLC_AU_BRAND]: {
        currencyCode: 'AUD',
      },
      [DDS_UK_BRAND]: {
        currencyCode: 'GBP',
      },
    };
  }

  public static forPrStage(): PaymentsStackConfig {
    return {
      currencyCode: 'GBP',
    };
  }

  public static fromEnvironmentVariables(stage: string, brand: string): PaymentsStackConfig {
    return {
      currencyCode: getEnv(PaymentsStackEnvironmentKeys.CURRENCY_CODE),
    };
  }
}
