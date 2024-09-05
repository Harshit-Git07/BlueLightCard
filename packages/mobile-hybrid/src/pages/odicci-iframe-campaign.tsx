import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAtomValue, useSetAtom } from 'jotai';
import { userProfile } from '@/components/UserProfileProvider/store';
import { spinner } from '@/modules/Spinner/store';

const IframeCampaignPage: NextPage = () => {
  const setSpinner = useSetAtom(spinner);
  const router = useRouter();
  const userProfileValue = useAtomValue(userProfile);

  const iframeUrl = router.query?.iframeUrl as string;
  if (!iframeUrl && router.isReady) router.push('/');

  useEffect(() => {
    setSpinner(true);

    if (!iframeUrl || !userProfileValue || !userProfileValue?.uuid) return;

    setSpinner(false);
  }, [iframeUrl, userProfileValue, setSpinner]);

  if (!userProfileValue || !userProfileValue?.uuid) return null;
  const iframeUrlWithUuid = `${iframeUrl}?odicci_external_user_id=${userProfileValue.uuid}`;

  return (
    <div className="w-100vw h-[100vh]">
      <iframe
        id="odicciIframe"
        data-testid="odicci-iframe"
        className="w-full h-full"
        style={{ textAlign: 'center' }}
        src={iframeUrlWithUuid}
      />
    </div>
  );
};

export default IframeCampaignPage;
