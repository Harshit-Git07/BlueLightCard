import { useRouter } from 'next/router';
import VerticalMenuItem, { Props as VerticalMenuItemProps } from '../VerticalMenuItem';
import { faSignOut, faArrowUpRightFromSquare } from '@fortawesome/pro-regular-svg-icons';
import { ThemeVariant } from '../../types';
import Button from '../Button-V2';

const items: VerticalMenuItemProps[] = [
  { label: 'Your card', selected: false, href: '/my-card', isExternalLink: false },
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
    <div className="relative h-full min-w-[290px]">
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

        <li className="mobile:hidden tablet:block h-[50px] ml-[-8px] flex items-center">
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

      <div className="mobile:block tablet:hidden absolute bottom-24 w-full">
        <div className="flex justify-center">
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
      </div>
    </div>
  );
};

export default LeftNavigationLinks;
