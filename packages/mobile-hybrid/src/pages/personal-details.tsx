import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const PersonalDetailsPage: NextPage = () => {
  useRouterReady();

  const memberUuid = 'test';

  return (
    <>
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div>Personal information page</div>
    </>
  );
};

export default PersonalDetailsPage;
