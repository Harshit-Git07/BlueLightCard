import * as nextRouter from 'next/router';

const useRouter = () => ({
  route: '/',
  pathname: '',
  query: {},
  asPath: '',
});

const mockRouterDecorator = (Story) => {
  nextRouter.useRouter = useRouter;
  return <Story />;
};

export default mockRouterDecorator;
