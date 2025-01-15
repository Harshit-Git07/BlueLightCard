import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, useMemberId, PersonalInformation } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PersonalDetailsPage: NextPage = () => {
  useRouterReady();

  const memberId = useMemberId();

  return (
    <>
      <AccountPagesHeader title="Personal Information" />
      <CardVerificationAlerts memberUuid={memberId} />
      <div className="p-[16px]">
        <PersonalInformation />
      </div>
    </>
  );
};

export default PersonalDetailsPage;
