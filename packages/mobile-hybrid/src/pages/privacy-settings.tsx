import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';

const PrivacySettingsPage: NextPage = () => {
  useRouterReady();

  return <div>Privacy settings page</div>;
};

export default PrivacySettingsPage;
