import { useRouter } from 'next/router';
import { faArrowUpRightFromSquare, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import {
  ButtonV2 as Button,
  ThemeVariant,
  VerticalMenuItem,
  VerticalMenuItemProps,
} from '@bluelightcard/shared-ui';
import { BRANDS } from '@/types/brands.enum';
import { BRAND } from '@/global-vars';
import { getLogoutUrl } from '../../auth/authUrls';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';
import getDeviceFingerprint from '@/utils/amplitude/getDeviceFingerprint';

const helpUrls: Record<BRANDS, string> = {
  'blc-uk': 'https://support.bluelightcard.co.uk/hc/en-gb',
  'blc-au': 'https://support-zendesk.bluelightcard.com.au/hc/en-gb',
  'dds-uk': 'https://support.defencediscountservice.co.uk/hc/en-gb',
};

const items: VerticalMenuItemProps[] = [
  { label: 'Your card', selected: false, href: '/your-card', isExternalLink: false },
  {
    label: 'Personal information',
    selected: false,
    href: '/personal-information',
    isExternalLink: false,
  },
  { label: 'Privacy', selected: false, href: '/privacy-settings', isExternalLink: false },
  {
    label: 'Marketing preferences',
    selected: false,
    href: '/preferences',
    isExternalLink: false,
  },
  {
    label: 'Help',
    selected: false,
    href: helpUrls[BRAND],
    isExternalLink: true,
    icon: faArrowUpRightFromSquare,
  },
];

type Props = {
  onSelection: (href: string) => void;
};

const LeftNavigationLinks = ({ onSelection }: Props) => {
  const { pathname } = useRouter();

  const cognitoUIExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.IDENTITY_COGNITO_UI_ENABLED,
    'control',
    getDeviceFingerprint()
  );

  const auth0Experiment = useAmplitudeExperiment(
    getAuth0FeatureFlagBasedOnBrand(BRAND),
    'off',
    getDeviceFingerprint()
  );

  const isCognitoUIEnabled = cognitoUIExperiment.data?.variantName === 'treatment';
  const isAuth0LoginLogoutWebEnabled = auth0Experiment.data?.variantName === 'on';

  return (
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
      <li className="h-[50px] ml-[17px] tablet:ml-[0] flex items-center">
        <Button
          variant={ThemeVariant.Tertiary}
          iconRight={faSignOut}
          borderless
          type="button"
          href={getLogoutUrl({ isAuth0LoginLogoutWebEnabled, isCognitoUIEnabled })}
        >
          Log out
        </Button>
      </li>
    </ul>
  );
};

export default LeftNavigationLinks;
