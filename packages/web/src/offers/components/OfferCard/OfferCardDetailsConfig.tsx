import { faGlobe, faTag, faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type OfferTagType = {
  offerTagIcon: JSX.Element | undefined;
  offerTagText: string | undefined;
};

export const convertOfferTagIndexToString = (tagIndex: number | undefined) => {
  switch (tagIndex) {
    case 5:
      return 'high street';
    case 0:
      return 'online offer';
    case 2:
      return 'gift card';
    case 6:
      return 'local offer';
    default:
      return '';
  }
};

export default function OfferCardDetailsConfig(offerTag: string): OfferTagType {
  const offerTypes: { [key: string]: OfferTagType } = {
    'high street': {
      offerTagText: 'High street offer',
      offerTagIcon: <FontAwesomeIcon icon={faTag} className="pr-1" />,
    },
    'online offer': {
      offerTagIcon: <FontAwesomeIcon icon={faGlobe} className="pr-1" />,
      offerTagText: 'Online offer',
    },
    'gift card': {
      offerTagIcon: <FontAwesomeIcon icon={faGift} className="pr-1" />,
      offerTagText: 'Giftcard offer',
    },
    'local offer': {
      offerTagIcon: undefined,
      offerTagText: 'Local offer',
    },
  };

  return Object.keys(offerTypes).includes(offerTag)
    ? (offerTypes[offerTag] as OfferTagType)
    : { offerTagIcon: undefined, offerTagText: '' };
}
