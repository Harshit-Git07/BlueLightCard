import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAtomValue, useSetAtom } from 'jotai';
import { userProfile } from '@/components/UserProfileProvider/store';
import { spinner } from '@/modules/Spinner/store';
import { Button, ThemeVariant } from '@bluelightcard/shared-ui';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import Head from 'next/head';

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

  const onBackClick = () => {
    setSpinner(true);
    router.push('/');
  };

  return (
    <div className="w-full h-full fixed z-50 top-0 flex flex-col">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="frame-src *.odicci.com" />
      </Head>

      <div className="py-2">
        <Button variant={ThemeVariant.Tertiary} iconLeft={faChevronLeft} onClick={onBackClick}>
          Back to Home
        </Button>
      </div>

      <iframe
        id="odicciIframe"
        data-testid="odicci-iframe"
        className="w-full grow"
        style={{ textAlign: 'center' }}
        src={iframeUrlWithUuid}
      />
    </div>
  );
};

export default IframeCampaignPage;
