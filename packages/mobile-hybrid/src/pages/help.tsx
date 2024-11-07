import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';

const HelpPage: NextPage = () => {
  useRouterReady();

  return <div>Help page</div>;
};

export default HelpPage;
