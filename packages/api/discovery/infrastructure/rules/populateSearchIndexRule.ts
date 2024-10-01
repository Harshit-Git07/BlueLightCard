import { EventBusRuleProps, FunctionDefinition } from 'sst/constructs';

export const populateSearchIndexRule = (functionDefinition: FunctionDefinition): EventBusRuleProps => ({
  pattern: { source: ['opensearch.populate.index'] },
  targets: {
    populateOpenSearchFunction: {
      function: functionDefinition,
    },
  },
});
