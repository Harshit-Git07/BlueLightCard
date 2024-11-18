import { Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { EventBus, IRuleTarget, Match, Rule } from 'aws-cdk-lib/aws-events';

export class StripeEventBridge {
  private readonly stack: Stack;

  constructor(stack: Stack, existingStripeBusArn: string, stripeEventSourcePrefix: string, handler: IRuleTarget) {
    this.stack = stack;

    // Load existing EventBus using ARN
    const eventBus = EventBus.fromEventBusArn(this.stack, 'ExistingStripeEventBus', existingStripeBusArn);

    // Create a new rule with a pattern
    const rule = new Rule(this.stack, 'StripeEvents', {
      eventBus,
      eventPattern: {
        source: events.Match.prefix(stripeEventSourcePrefix),
      },
    });

    // Add the Lambda function as the target of the rule
    rule.addTarget(handler);
  }
}
