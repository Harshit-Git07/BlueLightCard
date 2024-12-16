import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const HelpPage: NextPage = () => {
  useRouterReady();

  const memberUuid = 'test';

  return (
    <>
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div>Help page</div>
    </>
  );
};

export default HelpPage;
