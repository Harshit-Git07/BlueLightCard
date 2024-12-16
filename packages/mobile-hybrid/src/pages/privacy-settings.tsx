import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const PrivacySettingsPage: NextPage = () => {
  useRouterReady();

  const memberUuid = 'test';

  return (
    <>
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div>Privacy settings page</div>
    </>
  );
};

export default PrivacySettingsPage;
