import { StackContext, NextjsSite } from 'sst/constructs';

export function Web({ stack }: StackContext) {
  const site = new NextjsSite(stack, 'Site', {
    path: 'packages/web/',
  });

  stack.addOutputs({
    URL: site.url,
  });
}
