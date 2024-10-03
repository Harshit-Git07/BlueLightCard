import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAtomValue, useSetAtom } from 'jotai';
import { userProfile } from '@/components/UserProfileProvider/store';
import { spinner } from '@/modules/Spinner/store';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Button, ThemeVariant, usePlatformAdapter } from '@bluelightcard/shared-ui';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import Head from 'next/head';

const IframeCampaignPage: NextPage = () => {
  const platformAdapter = usePlatformAdapter();
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

  const onBoostedOffersClick = () => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.BLUE_REWARDS_CLICKED, {
      click_type: 'Boosted Offers',
    });

    platformAdapter.navigate('/flexibleOffers.php?id=0');
  };
  const onTermsClick = () => {
    platformAdapter.logAnalyticsEvent(AmplitudeEvents.BLUE_REWARDS_CLICKED, {
      click_type: 'T&Cs',
    });

    platformAdapter.navigateExternal('https://prizedraw-terms-conditions.bluelightcard.co.uk/');
  };

  return (
    /*
      Fixed styling and bottom padding has to be applied to page to clear Android bottom nav.
      This means that there is a larger gap at the bottom of the page on iOS.
      Hybrid has no way of knowing whether Android or iOS so cannot apply custom styling.
      Mobile team are aware of this, there's not a good fix.
      Yeah it sucks.
    */
    <div className="w-full h-full fixed z-50 top-0 pb-5 flex flex-col">
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
      <div className="grid">
        <Button variant={ThemeVariant.Tertiary} onClick={onTermsClick}>
          Terms and Conditions
        </Button>
        <Button variant={ThemeVariant.Tertiary} onClick={onBoostedOffersClick}>
          Boosted Offers
        </Button>
      </div>
    </div>
  );
};

export default IframeCampaignPage;
