import { Event as SanityEvent } from '@bluelightcard/sanity-types';
import { addDays, addMonths } from 'date-fns';

const richTextModuleArray = [
  {
    _key: 'block1',
    children: [
      {
        _key: 'span1',
        text: 'This is a heading',
        marks: [] as string[],
        _type: 'span' as const,
      },
    ],
    style: 'h1' as const,
    listItem: 'number' as const,
    markDefs: [] as never[],
    level: 1,
    _type: 'block' as const,
  },
  {
    _key: 'block2',
    children: [
      {
        _key: 'span2',
        text: 'This is a paragraph.',
        marks: [] as string[],
        _type: 'span' as const,
      },
    ],
    style: 'normal' as const,
    markDefs: [
      {
        _key: 'link1',
        _type: 'link' as const,
        href: 'https://example.com',
      },
    ],
    level: 1,
    _type: 'block' as const,
  },
];

const defaultTestSanityEventOffer: SanityEvent = {
  _id: '1',
  _type: 'event',
  _createdAt: '2023-01-01T00:00:00Z',
  _updatedAt: new Date().toISOString(),
  _rev: 'rev-id',
  name: 'Test event',
  status: 'live',
  eventDescription: richTextModuleArray,
  ticketFaceValue: '£10',
  series: {
    _createdAt: '2024-11-29T11:37:38Z',
    _id: '9147424e-364c-450a-95ee-67924caebac0',
    _rev: '7kbWhT732kOPaxkjpQ9ZCd',
    _type: 'event.series',
    _updatedAt: '2024-11-29T11:38:04Z',
    title: 'Comedy Events',
  },
  venue: {
    _createdAt: '2024-12-05T14:52:59Z',
    _id: 'dc1adf94-f6f5-4d77-a155-65f72928fb77',
    _rev: '5C7r9qKmADH0BJVlJ8rdiQ',
    _type: 'venue',
    _updatedAt: '2024-12-05T14:53:32Z',
    addressLine1: 'Peninsula Square',
    venueDescription: [
      {
        _type: 'block',
        _key: '105e5365c1fe',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '701da2126ad0',
            text: 'This is the first line',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'a54bb54dc755',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: '07e99216cd24',
            text: 'This is a third lines',
            marks: [],
          },
        ],
      },
    ],
    name: 'The O2 Arena',
    postcode: 'SE10 0DX',
    townCity: 'London',
  },
  ageRestrictions: [
    {
      _createdAt: '2024-09-20T11:25:22Z',
      _id: '78d85aee-7573-4497-a4de-1392d48691b3',
      _rev: 'EnjHxnWG7nhsRUiWgR5aZ2',
      _type: 'age.restriction',
      _updatedAt: '2024-12-12T01:30:43Z',
      description: 'Must be at least 18 years old.',
      name: '18+',
    },
  ],
  image: {
    default: {
      asset: {
        _id: 'image-id',
        url: 'https://example.com/image.jpg',
        _type: 'sanity.imageAsset',
        _createdAt: '2023-01-01T00:00:00Z',
        _updatedAt: '2023-01-02T00:00:00Z',
        _rev: 'image-revision-id',
      },
      _type: 'image',
    },
  },
  eventDate: addDays(new Date(), 2).toISOString(),
  eventEndDate: addMonths(new Date(), 1).toISOString(),
  guestlistComplete: addDays(new Date(), 1).toISOString(),
  redemptionDetails: {
    redemptionType: 'Ballot',
    drawDate: '2024-11-27T15:45:00.000Z',
    numberOfWinners: 12,
  },
  howThisWorks: {
    _createdAt: '2024-11-29T11:46:04Z',
    _id: '63c8a621-40a8-455d-98c8-eb0673f8a2f3',
    _rev: 'EnjHxnWG7nhsRUiWfDPBL2',
    _type: 'works',
    _updatedAt: '2024-12-05T15:21:03Z',
    howThisWorks: [
      {
        _key: 'bae5fbeebd60',
        _type: 'block',
        children: [
          {
            _key: 'a80d937c78c80',
            _type: 'span',
            marks: [],
            text: 'Tickets for this event are being balloted. By entering below, you will be put into a draw. When the ballot is drawn, you will be sent an email confirming the outcome.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _key: 'c383147a930f',
        _type: 'block',
        children: [
          {
            _key: 'b88e3bfe69930',
            _type: 'span',
            marks: [],
            text: 'If you are successful, we will email you and ask you to confirm your attendance to secure your tickets.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
    name: 'Ballot',
  },
  termsAndConditions: richTextModuleArray,
  categorySelection: [
    {
      _key: 'key',
      category1: {
        _id: 'category-id',
        _type: 'category',
        _createdAt: '2023-01-01',
        _updatedAt: '2023-01-01',
        _rev: 'rev-id',
        level: 1,
        id: 1,
        name: 'Category Item Name',
      },
      categoryItem: {
        _id: 'item-id',
        _type: 'category.item',
        _createdAt: '2023-01-01T00:00:00Z',
        _updatedAt: '2023-01-02T00:00:00Z',
        _rev: 'rev-id',
        id: 1,
        name: 'Category Item Name',
      },
    },
  ],
  includedTrust: [],
  excludedTrust: [
    {
      _createdAt: '2024-09-21T11:16:00Z',
      _id: '1021256801aea8359ac41110e7e980084b39bdbbda94308f293478331ce4e9c2',
      _rev: '7ka7e2D4B46GtcD4HOHgpB',
      _type: 'trust',
      _updatedAt: '2024-09-21T11:16:00Z',
      code: 'REGFOR',
      description: '',
      name: 'HM Armed Forces',
      trustId: 38,
    },
  ],
};

export function buildTestSanityEventOffer(overrides?: Partial<SanityEvent>): SanityEvent {
  return { ...defaultTestSanityEventOffer, ...overrides };
}
