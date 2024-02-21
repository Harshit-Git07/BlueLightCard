import { Stack } from 'aws-cdk-lib';
import { EventBus, EventBusRuleProps, use } from 'sst/constructs';

import { Shared } from '../../../../../stacks/stack';

export class EventBridge {
  private readonly bus: EventBus;
  private readonly stack: Stack;

  constructor(stack: Stack, ruleset: Record<string, EventBusRuleProps>) {
    const { bus } = use(Shared);
    this.bus = bus;
    this.stack = stack;
    this.bus.addRules(this.stack, ruleset);
  }
}
