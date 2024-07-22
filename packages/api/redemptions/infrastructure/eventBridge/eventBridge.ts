import { Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { EventBus, EventBusRuleProps, use } from 'sst/constructs';

import { Shared } from '../../../../../stacks/stack';

export class EventBridge {
  private readonly bus: EventBus;
  private readonly defaultBus: EventBus;
  private readonly stack: Stack;

  constructor(
    stack: Stack,
    customBusRuleset: Record<string, EventBusRuleProps>,
    defaultBusRuleset: Record<string, EventBusRuleProps>,
  ) {
    /**
     * custom event bus: [STAGE]-blc-mono-eventBus
     * ARN: arn:aws:events:[REGION]:[ACCOUNT]:event-bus/[STAGE]-blc-mono-eventBus
     */
    const { bus } = use(Shared);
    this.bus = bus;
    this.stack = stack;
    this.bus.addRules(this.stack, customBusRuleset);

    /**
     * default event bus
     * ARN: arn:aws:events:[REGION]:[ACCOUNT]:event-bus/default
     */
    this.defaultBus = new EventBus(stack, 'default', {
      cdk: {
        eventBus: events.EventBus.fromEventBusName(this.stack, 'DefaultEventBus', 'default'),
      },
    });
    this.defaultBus.addRules(this.stack, defaultBusRuleset);
  }
}
