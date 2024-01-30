import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { EventBusRuleProps } from 'sst/constructs';

import { EventBridgePermissions } from '../eventBridgePermissions';

export interface FunctionProps {
  functionName: string;
  permissions: EventBridgePermissions[];
  handler: string;
  environment: Record<string, string>;
  deadLetterQueueEnabled: boolean;
  deadLetterQueue: IQueue;
  retryAttempts: number;
}

export class Rule {
  private readonly ruleSet;

  constructor(name: string, patterns: string[], functionProps: FunctionProps) {
    this.ruleSet = this.createRule(name, patterns, functionProps);
  }

  private createRule(name: string, patterns: string[], functionPros: FunctionProps): Record<string, EventBusRuleProps> {
    const { functionName, permissions, environment, deadLetterQueue, handler, retryAttempts, deadLetterQueueEnabled } =
      functionPros;
    return {
      [name]: {
        pattern: { source: patterns },
        targets: {
          [functionName]: {
            function: {
              permissions,
              handler,
              environment,
              retryAttempts,
              deadLetterQueueEnabled,
              deadLetterQueue,
            },
          },
        },
      },
    };
  }

  getRuleSet(): Record<string, EventBusRuleProps> {
    return this.ruleSet;
  }
}
