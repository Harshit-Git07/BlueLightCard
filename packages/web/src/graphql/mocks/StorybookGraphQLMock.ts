export default {
  matcher: {
    name: 'graphql',
    url: 'path:/graphql',
  },
  response: {
    status: 200,
    body: {
      data: {
        banners: [
          {
            imageSource: '/assets/small-tenancy-banner_qatar-airways.jpg',
            link: 'www.google.com',
            __typename: 'Banner',
          },
          {
            imageSource: '/assets/small-tenancy-banner_warner-hotels.jpg',
            link: 'www.apple.com',
            __typename: 'Banner',
          },
        ],
      },
    },
  },
};
