import { StackContext, NextjsSite, use } from 'sst/constructs';
import { Identity } from '@blc-mono/identity/stack';
import { Offers } from '../api/offers/stack';

export function MemberServicesHub({ stack }: StackContext) {
  const { identityApi } = use(Identity);
  const { offersApi } = use(Offers);

  const site = new NextjsSite(stack, 'member-services-hub', {
    path: 'packages/member-services-hub/',
    environment: {},
  });

  stack.addOutputs({
    URL: site.url,
  });
}
