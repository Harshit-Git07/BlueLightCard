import { EventBus, use } from 'sst/constructs';
import { Shared } from '../../../../stacks/stack';
import { Stack } from 'aws-cdk-lib';
import { Rule } from './rules/rule';

export class EventBridge {
  private readonly bus: EventBus;
  private readonly stack: Stack;

  constructor(stack: Stack, rules: Rule[]) {
    const { bus } = use(Shared);
    this.bus = bus;
    this.stack = stack;
    this.createRules(rules);
  }

  private createRules(rules: Rule[]): void {
    rules.forEach((rule: Rule) => {
      this.bus.addRules(this.stack, rule.getRuleSet());
    });
  }
}
