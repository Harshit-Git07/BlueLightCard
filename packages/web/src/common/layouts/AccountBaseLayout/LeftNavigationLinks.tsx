import { useRouter } from 'next/router';
import { faArrowUpRightFromSquare, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import {
  ButtonV2 as Button,
  ThemeVariant,
  VerticalMenuItem,
  VerticalMenuItemProps,
} from '@bluelightcard/shared-ui';

const items: VerticalMenuItemProps[] = [
  { label: 'Your card', selected: false, href: '/your-card', isExternalLink: false },
  {
    label: 'Personal information',
    selected: false,
    href: '/personal-details',
    isExternalLink: false,
  },
  { label: 'Privacy', selected: false, href: '/privacy-settings', isExternalLink: false },
  { label: 'Contact preferences', selected: false, href: '/preferences', isExternalLink: false },
  {
    label: 'Help',
    selected: false,
    href: 'https://support.bluelightcard.co.uk/hc/en-gb',
    isExternalLink: true,
    icon: faArrowUpRightFromSquare,
  },
];

type Props = {
  onSelection: (href: string) => void;
};

const LeftNavigationLinks = ({ onSelection }: Props) => {
  const { pathname } = useRouter();

  return (
    <>
      <ul>
        {items.map((item, index) => {
          const id = `left-nav-link-${index}`;
          const selected = pathname.startsWith(item.href!);

          return (
            <VerticalMenuItem
              key={id}
              label={item.label}
              icon={item.icon}
              href={item.isExternalLink ? item.href : undefined}
              isExternalLink={item.isExternalLink}
              selected={selected}
              onClick={onSelection.bind(this, item.href!)}
            />
          );
        })}

        <li className="h-[50px] ml-[-6px] tablet:ml-[-22px] flex items-center">
          <Button
            variant={ThemeVariant.Tertiary}
            iconRight={faSignOut}
            borderless={true}
            type="button"
            onClick={() => {}}
          >
            Log out
          </Button>
        </li>
      </ul>
    </>
  );
};

export default LeftNavigationLinks;
