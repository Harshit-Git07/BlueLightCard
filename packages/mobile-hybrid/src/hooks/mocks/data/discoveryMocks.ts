const discoveryMocks = {
  '/eu/discovery/campaigns': {
    statusCode: 200,
    body: JSON.stringify({
      data: [],
    }),
  },
  '/eu/discovery/menu': {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        id: 'list1',
        title: 'Offer Boosts for you',
        description:
          'This week, we have partnered with some of our partners to reward you with even bigger discounts. Why not take a look at these Offer Boosts…',
        imageURL: 'https://cdn.bluelightcard.co.uk/flexible/home/bbr-offer-boosts-week6-flexi.jpg',
        offers: [
          {
            offerID: 23283,
            offerName: 'Deal of the Week 1',
            offerType: 'Online',
            imageURL: 'http://example.com/image1.jpg',
            companyID: '23638',
            companyName: 'Company 1',
          },
        ],
      },
    }),
  },
  contentcardsRequest: [
    {
      created: '1729003614',
      description: 'Test description 1',
      extras: {
        destination: 'app-notifications',
      },
      href: '/reportcodeleaks.php',
      id: 'mock-notification-id-one',
      isClicked: 'false',
      title: '2 months free health insurance with AXA Health',
      updated: '1729003614',
    },
    {
      created: '1729003615',
      description: 'Test description 2',
      extras: {
        destination: 'app-notifications',
      },
      href: '/offerdetails.php?oid=13585&cid=1234',
      id: 'mock-notification-id-two',
      isClicked: 'true',
      title: 'Exclusive savings at Myprotein',
      updated: '1729003615',
    },
  ],
  contentcardsLogClick: {},
};

export default discoveryMocks;
