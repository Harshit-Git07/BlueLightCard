import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const PreferencesPage: NextPage = () => {
  useRouterReady();

  const memberUuid = 'test';

  return (
    <>
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div>Contact preferences page</div>
    </>
  );
};

export default PreferencesPage;
