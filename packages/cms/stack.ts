import { StackContext, NextjsSite, use } from 'sst/constructs';
import { Identity } from '../../packages/api/identity/stack';
import { Offers } from '../../packages/api/offers/stack';

export function CMS({ stack }: StackContext) {
  const { identityApi } = use(Identity);
  const { offersApi } = use(Offers);

  const site = new NextjsSite(stack, 'AdminPanelSite', {
    path: 'packages/cms/',
    environment: {
      IDENTITY: identityApi.url,
      OFFERS: offersApi.graphqlUrl,
    },
  });

  stack.addOutputs({
    URL: site.url,
  });
}
