import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';

const PreferencesPage: NextPage = () => {
  useRouterReady();

  return <div>Contact preferences page</div>;
};

export default PreferencesPage;
