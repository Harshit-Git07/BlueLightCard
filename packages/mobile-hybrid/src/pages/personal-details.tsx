import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, Drawer } from '@bluelightcard/shared-ui';
import PersonalDetails from '@bluelightcard/shared-ui/components/PersonalDetails';
import Toaster from '@bluelightcard/shared-ui/components/Toast/Toaster';

const PersonalDetailsPage: NextPage = () => {
  const memberId = 'test';
  useRouterReady();

  return (
    <>
      <Toaster />
      <Drawer />
      <CardVerificationAlerts memberUuid={memberId} />
      <PersonalDetails />
    </>
  );
};

export default PersonalDetailsPage;
