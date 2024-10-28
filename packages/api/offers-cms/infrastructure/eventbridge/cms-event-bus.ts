import { EventBus, type Function as SSTFunction, type Stack } from 'sst/constructs';

export function createCMSEventBus(
  stack: Stack,
  busName: string,
  dependencies: { consumerFunction: SSTFunction },
): EventBus {
  const { consumerFunction } = dependencies;
  const cmsEventBus = new EventBus(stack, busName);

  const sanityRule = {
    pattern: { source: ['lambda.sanity.webhook'] },
    targets: {
      consumerTarget: {
        function: consumerFunction,
      },
    },
  };

  const dataWarehouseOfferRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['offer'],
        },
      },
    },
  };
  const dataWarehouseCompanyRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['company'],
        },
      },
    },
  };
  const dataWarehoseMenuRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['menu'],
        },
      },
    },
  };

  cmsEventBus.addRules(stack, {
    sanityRule,
    dataWarehouseOfferRule,
    dataWarehouseCompanyRule,
    dataWarehoseMenuRule,
  });

  return cmsEventBus;
}
