import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, PersonalInformation } from '@bluelightcard/shared-ui';

const PersonalDetailsPage: NextPage = () => {
  useRouterReady();

  const memberUuid = 'test';

  return (
    <>
      <CardVerificationAlerts memberUuid={memberUuid} />
      <PersonalInformation />
    </>
  );
};

export default PersonalDetailsPage;
