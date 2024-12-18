import { NextPage } from 'next';
import { faSignOut } from '@fortawesome/pro-regular-svg-icons';
import {
  AccountDetails,
  VerticalMenuItem,
  VerticalMenuItemProps,
  ButtonV2 as Button,
  ThemeVariant,
} from '@bluelightcard/shared-ui';
import useRouterReady from '@/hooks/useRouterReady';

const items: VerticalMenuItemProps[] = [
  {
    label: 'Personal information',
    selected: false,
    href: '/personal-information',
    isExternalLink: false,
  },
  { label: 'Privacy', selected: false, href: '/privacy-settings', isExternalLink: false },
  { label: 'Contact preferences', selected: false, href: '/preferences', isExternalLink: false },
  {
    label: 'Help',
    selected: false,
    href: '/help',
    isExternalLink: false,
  },
];

const AccountPage: NextPage = () => {
  useRouterReady();

  return (
    <>
      <div className="mt-4 flex flex-col gap-5">
        <div className="ml-4">
          <AccountDetails accountNumber="BLC0000000" firstName="Name" lastName="Last-name" />
        </div>

        <ul>
          {items.map((item, index) => {
            const id = `account-link-${index}`;

            return (
              <VerticalMenuItem
                key={id}
                label={item.label}
                icon={item.icon}
                href={item.href}
                isExternalLink={item.isExternalLink}
                selected={item.selected}
              />
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-16 flex justify-center w-full">
        <Button
          variant={ThemeVariant.Tertiary}
          iconRight={faSignOut}
          borderless={true}
          type="button"
          onClick={() => {}}
        >
          Log out
        </Button>
      </div>
    </>
  );
};

export default AccountPage;
