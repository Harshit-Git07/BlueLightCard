import { Decorator } from '@storybook/react';
import * as nextRouter from 'next/router';

const mockRouterDecorator: Decorator = (Story, { parameters }) => {
  const useRouter = () => ({
    isReady: true,
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    ...parameters.router,
  });

  (nextRouter as any).useRouter = useRouter;
  return <Story />;
};

export default mockRouterDecorator;
