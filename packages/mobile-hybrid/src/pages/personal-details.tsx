import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';

const PersonalDetailsPage: NextPage = () => {
  useRouterReady();

  return <div>Personal information page</div>;
};

export default PersonalDetailsPage;
