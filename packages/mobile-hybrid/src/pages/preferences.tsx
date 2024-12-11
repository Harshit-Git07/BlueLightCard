import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const PreferencesPage: NextPage = () => {
  const memberId = 'test';
  useRouterReady();

  return (
    <>
      <CardVerificationAlerts memberUuid={memberId} />
      <div>Contact preferences page</div>
    </>
  );
};

export default PreferencesPage;
