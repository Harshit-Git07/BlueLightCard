import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

export type SocialMediaIconProps = {
  iconName: 'facebook' | 'instagram' | 'linkedin' | 'xtwitter' | 'tiktok';
  link: string;
  helpText: string;
  id?: string;
};

const SocialMediaIcon: FC<SocialMediaIconProps> = ({ iconName, link, helpText, id }) => {
  let icon;
  switch (iconName.toLowerCase().replace(/\s+|-/g, '')) {
    case 'facebook':
      icon = faFacebookF;
      break;
    case 'xtwitter':
      icon = faXTwitter;
      break;
    case 'tiktok':
      icon = faTiktok;
      break;
    case 'linkedin':
      icon = faLinkedinIn;
      break;
    case 'instagram':
      icon = faInstagram;
      break;
    default:
      return <></>;
  }

  return (
    icon && (
      <Link href={link}>
        <div title={helpText} data-testid={id}>
          <FontAwesomeIcon
            icon={icon}
            className="text-footer-social-icon-colour dark:text-footer-social-icon-colour-dark hover:text-footer-link-hover-colour dark:hover:text-footer-link-hover-colour-dark"
            size="lg"
          />
        </div>
      </Link>
    )
  );
};

export default SocialMediaIcon;
