import { StackContext } from 'sst/constructs';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { getDefaultFunctionProps } from '@blc-mono/members/infrastructure/stacks/shared/builders/defaultFunctionPropsBuilder';
import { EventBus } from '@blc-mono/members/infrastructure/stacks/event-stack/event-bus/EventBus';

export async function MembersEventsStack({ stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  new EventBus(stack);
}
