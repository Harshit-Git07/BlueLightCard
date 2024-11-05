import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CheckoutController } from '@blc-mono/orders/application/controllers/apiGateway/checkout/CheckoutController';
import { CheckoutService } from '@blc-mono/orders/application/services/checkout/CheckoutService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'orders';
const logger = new LambdaLogger({ serviceName: `${service}-checkout-post` });

global.crypto = require('node:crypto');

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)

  //API service
  .provideClass(CheckoutService.key, CheckoutService)

  // Controller
  .injectClass(CheckoutController);

/**
 * Handler for a REST API endpoint to create a checkout
 */
export const handler = controller.invoke;
