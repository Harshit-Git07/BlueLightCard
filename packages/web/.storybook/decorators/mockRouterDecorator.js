import * as nextRouter from 'next/router';

const mockRouterDecorator = (Story, { parameters }) => {
  const useRouter = () => ({
    isReady: true,
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
    ...parameters.router,
  });

  nextRouter.useRouter = useRouter;
  return <Story />;
};

export default mockRouterDecorator;
