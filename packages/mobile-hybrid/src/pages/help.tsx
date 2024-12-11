import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';

const HelpPage: NextPage = () => {
  const memberId = 'test';
  useRouterReady();

  return (
    <>
      <CardVerificationAlerts memberUuid={memberId} />
      <div>Help page</div>
    </>
  );
};

export default HelpPage;
