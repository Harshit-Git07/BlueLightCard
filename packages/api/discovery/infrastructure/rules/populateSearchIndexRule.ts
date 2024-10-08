import { EventBusRuleProps, FunctionDefinition } from 'sst/constructs';

import { Events } from '../eventHandling/events';

export const populateSearchIndexRule = (functionDefinition: FunctionDefinition): EventBusRuleProps => ({
  pattern: { source: [Events.OPENSEARCH_POPULATE_INDEX] },
  targets: {
    populateOpenSearchFunction: {
      function: functionDefinition,
    },
  },
});
