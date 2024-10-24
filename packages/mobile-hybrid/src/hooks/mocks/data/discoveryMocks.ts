const discoveryMocks = {
  '/eu/discovery/campaigns': {
    statusCode: 200,
    body: JSON.stringify({
      data: [],
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
