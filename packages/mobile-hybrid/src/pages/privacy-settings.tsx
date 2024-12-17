import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import Button from '../../../shared-ui/src/components/Button-V2/index';
import { CardVerificationAlerts, ThemeVariant } from '../../../shared-ui/';
import {
  faDownload,
  faTrash,
  faArrowUpRightFromSquare,
  faChevronLeft,
} from '@fortawesome/pro-solid-svg-icons';
import { fonts } from '../../../shared-ui/src/tailwind/theme';
import InvokeNativeNavigation from '@/invoke/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PrivacySettingsPage: NextPage = () => {
  useRouterReady();

  const navigation = new InvokeNativeNavigation();

  const descriptionStyle = ` ${fonts.body} text-colour-onSurface-subtle-light dark:!text-colour-onSurface-subtle-dark pb-2`;

  const backBtn = () => {
    window.history.back();
  };

  const memberId = 'test';

  return (
    <div className="max-w-[500px]">
      <div className="p-3 grid grid-cols-3 border-b-[0.2px] border-colour-onSurface-outline-outline-subtle-light dark:border-colour-onSurface-outline-outline-subtle-dark">
        <button
          onClick={backBtn}
          className="text-start text-colour-primary-light dark:text-colour-primary-dark text-lg"
        >
          <FontAwesomeIcon
            data-testid="back-icon"
            icon={faChevronLeft}
            size="xs"
            className="pr-2 text-colour-primary-light dark:text-colour-primary-dark"
          />
          Back
        </button>
        <div className="grid-cols-2">
          <h3
            className={`pb-1 text-center text-colour-onSurface dark:text-colour-onSurface-dark ${fonts.titleMedium}`}
          >
            Privacy
          </h3>
        </div>
      </div>

      <CardVerificationAlerts memberUuid={memberId} />

      <div className="px-4">
        <div className="py-5 grid w-full">
          <div className="col-span-2">
            <h3
              className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
            >
              Permissions and mobile data
            </h3>
            <p
              className={` ${fonts.body} text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark pb-2`}
            >
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
            <h3
              className={`pb-1 text-colour-onSurface dark:text-colour-onSurface-dark ${fonts.body}`}
            >
              Request your data access
            </h3>
            <p
              className={` ${fonts.body} text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark pb-2`}
            >
              Access all the data we hold on you anytime you wish.
            </p>
          </div>
          <div className="flex w-full max-w-[200px]">
            <Button
              className="!px-0"
              invertColor={false}
              variant={ThemeVariant.Tertiary}
              iconRight={faDownload}
              onClick={() =>
                navigation.navigate(
                  '/url.php?url=https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=2355368663796',
                )
              }
            >
              Request your data
            </Button>
          </div>
        </div>

        <div className="pb-5 grid w-full">
          <div className="col-span-2">
            <h3
              className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
            >
              Terms and conditions
            </h3>
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
            <h3
              className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
            >
              Privacy notice
            </h3>
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
            <h3
              className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
            >
              Legal and regulatory
            </h3>
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
            <h3
              className={`pb-1 ${fonts.body} text-colour-onSurface dark:text-colour-onSurface-dark`}
            >
              Delete your account
            </h3>
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
              onClick={() =>
                navigation.navigate(
                  '/url.php?url=https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=2355368663796',
                )
              }
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsPage;
