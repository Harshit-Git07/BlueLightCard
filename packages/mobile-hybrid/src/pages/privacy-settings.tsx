import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import {
  CardVerificationAlerts,
  ThemeVariant,
  useMemberId,
  fonts,
  ButtonV2 as Button,
  colours,
} from '@bluelightcard/shared-ui';
import { faDownload, faTrash, faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';

import InvokeNativeNavigation from '@/invoke/navigation';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PrivacySettingsPage: NextPage = () => {
  useRouterReady();

  const memberId = useMemberId();
  const navigation = new InvokeNativeNavigation();

  const descriptionStyle = `${fonts.body} text-colour-onSurface-subtle-light dark:!text-colour-onSurface-subtle-dark pb-2`;

  return (
    <>
      <AccountPagesHeader title="Privacy Settings" />
      <CardVerificationAlerts memberUuid={memberId} />
      <div className="p-[16px]">
        <div className="py-5 grid w-full">
          <div className="col-span-2">
            <h3 className={`pb-1 ${fonts.body} ${colours.textOnSurface}`}>
              Permissions and mobile data
            </h3>
            <p className={`pb-2 ${fonts.body} ${colours.textOnSurfaceSubtle}`}>
              Details on required permissions and your mobile data usage.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faArrowUpRightFromSquare}
              onClick={() => navigation.navigate('/permissions.php')}
            >
              Manage permissions
            </Button>
          </div>
        </div>

        <div className="pb-5 grid w-full">
          <div className="col-span-2">
            <h3 className={`pb-1 ${colours.textOnSurface} ${fonts.body}`}>
              Request your data access
            </h3>
            <p className={`pb-2 ${fonts.body} ${colours.textOnSurfaceSubtle}`}>
              Access all the data we hold on you anytime you wish.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faDownload}
              onClick={() => navigation.navigate('/chat')}
            >
              Request your data
            </Button>
          </div>
        </div>

        <div className="pb-5 grid w-full">
          <div className="col-span-2">
            <h3 className={`pb-1 ${fonts.body} ${colours.textOnSurface}`}>Terms and conditions</h3>
            <p className={descriptionStyle}>
              Understand the rules and conditions when using Blue Light Card app.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faArrowUpRightFromSquare}
              onClick={() => navigation.navigate('/terms_and_conditions.php')}
            >
              Read details
            </Button>
          </div>
        </div>

        <div className="pb-5 grid w-full">
          <div className="col-span-2">
            <h3 className={`pb-1 ${fonts.body} ${colours.textOnSurface}`}>Privacy notice</h3>
            <p className={descriptionStyle}>
              Learn what information we collect and how we use it to protect your data.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faArrowUpRightFromSquare}
              onClick={() => navigation.navigate('/privacy-notice.php')}
            >
              Read details
            </Button>
          </div>
        </div>

        <div className="pb-5 grid w-full">
          <div className="col-span-2">
            <h3 className={`pb-1 ${fonts.body} ${colours.textOnSurface}`}>Legal and regulatory</h3>
            <p className={descriptionStyle}>
              Discover how we offer savings to our community and build partnerships with brands.{' '}
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faArrowUpRightFromSquare}
              onClick={() => navigation.navigate('/legal-and-regulatory.php')}
            >
              Read details
            </Button>
          </div>
        </div>

        <div className="grid w-full pb-[24px]">
          <div className="">
            <h3 className={`pb-1 ${fonts.body} ${colours.textOnSurface}`}>Delete your account</h3>
            <p className={descriptionStyle}>
              You can delete your account anytime. This will remove your personal data and end your
              access to the Blue Light Card community and its exclusive offers.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              variant={ThemeVariant.TertiaryDanger}
              iconRight={faTrash}
              onClick={() => navigation.navigate('/chat')}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacySettingsPage;
