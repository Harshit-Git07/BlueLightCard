export type OfferTypeStrLiterals = 'Online' | 'In-store' | 'Giftcards';

export type OfferTypeParserObj = {
  [key in OfferTypeStrLiterals]: {
    type: key;
    label: string;
  };
};

export const offerTypeParser: OfferTypeParserObj = {
  Online: {
    type: 'Online',
    label: 'Online',
  },
  'In-store': {
    type: 'In-store',
    label: 'In-store',
  },
  Giftcards: {
    type: 'Giftcards',
    label: 'Gift card',
  },
};
