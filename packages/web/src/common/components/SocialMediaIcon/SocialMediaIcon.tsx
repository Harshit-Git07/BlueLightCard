import { FC } from 'react';
import SocialMediaIconProps from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const SocialMediaIcon: FC<SocialMediaIconProps> = ({ iconName, link, helpText }) => {
  let icon;
  switch (iconName.toLowerCase()) {
    case 'facebook':
      icon = faFacebook;
      break;
    case 'twitter':
      icon = faTwitter;
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
        <div
          className="aspect-square w-6 h-6 rounded-md flex bg-font-cta-standard-secondary-dark"
          title={helpText}
        >
          <FontAwesomeIcon icon={icon} className="text-palette-primary-base m-auto" size="xl" />
        </div>
      </Link>
    )
  );
};

export default SocialMediaIcon;
