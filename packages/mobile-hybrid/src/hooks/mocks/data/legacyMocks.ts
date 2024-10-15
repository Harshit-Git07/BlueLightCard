const legacyMocks = {
  '/api/4/news/list.php': {
    data: [
      {
        nid: 412,
        newsId: 'a3e0a70a-764e-11ef-9feb-115818e0b031',
        when: '2024-09-19 07:16:00',
        title: 'Blue Light Card welcomes the homelessness workforce to its community',
        body: '',
        image: 'a3e0a70a-764e-11ef-9feb-115818e0b031-1726726560.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/a3e0a70a-764e-11ef-9feb-115818e0b031-1726726560.jpg',
      },
      {
        nid: 411,
        newsId: '195fba7a-6f5b-11ef-a9b9-7b1efb286d54',
        when: '2024-09-10 10:57:00',
        title: 'Introducing Big Blue Rewards',
        body: '',
        image: '195fba7a-6f5b-11ef-a9b9-7b1efb286d54-1725962253.png',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/195fba7a-6f5b-11ef-a9b9-7b1efb286d54-1725962253.png',
      },
      {
        nid: 410,
        newsId: '788c00c4-65e9-11ef-9315-15dd5071cfbe',
        when: '2024-08-29 10:31:00',
        title: 'Introducing the Blue Light Card Deal Finder',
        body: '',
        image: '788c00c4-65e9-11ef-9315-15dd5071cfbe-1724923889.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/788c00c4-65e9-11ef-9315-15dd5071cfbe-1724923889.jpg',
      },
      {
        nid: 409,
        newsId: '8b4670f4-5983-11ef-98fd-e58f1ce53ae9',
        when: '2024-08-13 15:51:00',
        title: 'Grab a time-limited exclusive credit card deal',
        body: '',
        image: '8b4670f4-5983-11ef-98fd-e58f1ce53ae9-1723560698.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/8b4670f4-5983-11ef-98fd-e58f1ce53ae9-1723560698.jpg',
      },
      {
        nid: 408,
        newsId: '1074fc2e-5019-11ef-bddb-7dc448680187',
        when: '2024-08-01 16:16:00',
        title: 'NHS heroes always on call to help others even during retirement  ',
        body: '',
        image: '1074fc2e-5019-11ef-bddb-7dc448680187-1722525405.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/1074fc2e-5019-11ef-bddb-7dc448680187-1722525405.jpg',
      },
      {
        nid: 407,
        newsId: '7aa43c4e-4fe8-11ef-be6b-052fa66912ea',
        when: '2024-08-01 10:28:00',
        title: "Don't sweat, save money with The Body Coach app",
        body: '',
        image: '7aa43c4e-4fe8-11ef-be6b-052fa66912ea-1722504538.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/7aa43c4e-4fe8-11ef-be6b-052fa66912ea-1722504538.jpg',
      },
      {
        nid: 405,
        newsId: 'ff89dce0-450f-11ef-9384-27071e843e7c',
        when: '2024-07-18 15:14:00',
        title: 'Unmissable savings at the Voucher Shop',
        body: '',
        image: 'ff89dce0-450f-11ef-9384-27071e843e7c-1721312048.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/ff89dce0-450f-11ef-9384-27071e843e7c-1721312048.jpg',
      },
      {
        nid: 404,
        newsId: '57ac6c6e-44fa-11ef-97a1-53a93f9141b0',
        when: '2024-07-18 12:39:00',
        title: 'Back to school shop',
        body: '',
        image: '57ac6c6e-44fa-11ef-97a1-53a93f9141b0-1721302747.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/57ac6c6e-44fa-11ef-97a1-53a93f9141b0-1721302747.jpg',
      },
      {
        nid: 403,
        newsId: '83a34410-3e23-11ef-b6fa-674b7a5b84d5',
        when: '2024-07-09 19:46:00',
        title: 'New credit card comparison service now available ',
        body: '',
        image: '83a34410-3e23-11ef-b6fa-674b7a5b84d5-1720550772.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/83a34410-3e23-11ef-b6fa-674b7a5b84d5-1720550772.jpg',
      },
      {
        nid: 401,
        newsId: '6cb0730a-324c-11ef-abf8-e9c96b60f543',
        when: '2024-06-24 18:08:00',
        title: 'An important update about your Blue Light Card account',
        body: '',
        image: '6cb0730a-324c-11ef-abf8-e9c96b60f543-1719248929.jpg',
        s3image:
          'https://blcimg-dev.img.bluelightcard.co.uk/news/6cb0730a-324c-11ef-abf8-e9c96b60f543-1719248929.jpg',
      },
    ],
    success: true,
    message: 'Found',
  },
  '/api/4/offer/promos_new.php': {
    success: true,
    message: 'Found',
    data: {
      deal: [
        {
          title: 'Deal of the Week',
          random: true,
          items: [
            {
              id: 12054,
              compid: 12045,
              offername: 'SALE: Up to 55% off RAC breakdown cover*',
              logos: '12045.jpg',
              companyname: 'RAC',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1727164314902.jpg',
              s3Image: null,
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/12045.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: 'www.bluelightcard.co.uk/images/offerimages/1564398465237.jpg',
              s3image: null,
            },
            {
              id: 19904,
              compid: 6765,
              offername: 'Offer Boost! Save 20% at Disney Store',
              logos: '6765.jpg',
              companyname: 'Disney Store',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1727684908787.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/6765.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
            {
              id: 21198,
              compid: 400,
              offername: 'Save 26% at Ray-Ban',
              logos: '400.jpg',
              companyname: 'Ray-Ban',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1720688937269.jpg',
              s3Image: null,
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/400.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: 'www.bluelightcard.co.uk/images/offerimages/1626430801409.jpg',
              s3image: null,
            },
            {
              id: 20372,
              compid: 19088,
              offername: 'Offer boost! Up to 50% off + extra 15% (was 12%)',
              logos: '19088.jpg',
              companyname: 'MyProtein',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1728044758918.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/19088.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
          ],
        },
      ],
      flexible: {
        title: 'Ways to save',
        subtitle: 'Browse our latest offers and best savings so you never miss out',
        random: false,
        items: [
          {
            title: 'Cinema Savings',
            imagehome:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-cinema-savings-flexi.jpg',
            imagedetail:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-cinema-savings-flexi.jpg',
            navtitle: 'Cinema Savings',
            intro: 'Experience the magic on the big screen - your escape awaits at the cinema...',
            footer: '',
            random: false,
            hide: false,
            items: [],
            id: 0,
          },
          {
            title: 'New offers',
            imagehome:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-new%20offers-flexi.jpg',
            imagedetail:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-new%20offers-flexi.jpg',
            navtitle: 'New offers',
            intro: 'Take a look at all of our new and latest offers!',
            footer: '',
            random: false,
            hide: false,
            items: [],
            id: 1,
          },
          {
            title: 'Fashion Favourites',
            imagehome:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-fashion-24.jpg',
            imagedetail:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-fashion-24.jpg',
            navtitle: 'Fashion Favourites',
            intro: 'Get the latest look for less with savings on a range of top fashion brands...',
            footer: '',
            random: true,
            hide: false,
            items: [],
            id: 2,
          },
          {
            title: 'Delicious Savings',
            imagehome:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-delicious-savings-24.jpg',
            imagedetail:
              'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/flexible/home/blc-delicious-savings-24.jpg',
            navtitle: 'Delicious Savings',
            intro: 'Eat out for less with our delicious savings on your favourite restaurants...',
            footer: '',
            random: true,
            hide: false,
            items: [],
            id: 3,
          },
          {
            imagehome:
              'https://blcimg-dev.img.bluelightcard.co.uk/flexible/home/640x320EatingOut.png',
            imagedetail:
              'https://blcimg-dev.img.bluelightcard.co.uk/flexible/header/1280x640EatingOut-Header.png',
            navtitle: 'Eating Out',
            title: 'Eating Out',
            intro:
              "A few ideas for eating out tonight.  For more options why not try the 'near me' search or the food and drink category.",
            random: false,
            hide: true,
            items: [],
            footer: '',
            id: 4,
          },
        ],
      },
      groups: [
        {
          title: 'Top Offers',
          random: false,
          items: [
            {
              id: 13585,
              compid: 13571,
              offername: '20% off a SIM & airtime plan',
              logos: '13571.jpg',
              companyname: 'EE Mobile',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1675344346764.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
            {
              id: 13585,
              compid: 13571,
              offername: 'Up to 55% off RAC breakdown cover*',
              logos: '13571.jpg',
              companyname: 'RAC',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1719395976796.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
            {
              id: 13585,
              compid: 13571,
              offername: '£50 off all bookings!',
              logos: '13571.jpg',
              companyname: 'Jet2Holidays',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1698056257433.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
          ],
        },
        {
          title: 'Limited time offer boosts',
          random: true,
          items: [
            {
              id: 13585,
              compid: 13571,
              offername: '30% off (was 15%) Dyson Outlet products',
              logos: '13571.jpg',
              companyname: 'Dyson',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1725875003442.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
            {
              id: 13585,
              compid: 13571,
              offername: '65% off your first box',
              logos: '13571.jpg',
              companyname: 'Abel & Cole',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1726653967924.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
            {
              id: 13585,
              compid: 13571,
              offername: 'Offer boost! Save 15% off almost everything',
              logos: '13571.jpg',
              companyname: 'The Fragrance Shop',
              image:
                'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1727424260379.jpg',
              s3Image: '',
              RestrictedTo: '',
              RestrictedFrom: '',
              absoluteLogos:
                'www.bluelightcard.co.uk/images/companyimages/complarge/retina/13571.jpg',
              s3logos: 'companyimages/complarge/retina/',
              absoluteImage: '',
              s3image: '',
            },
          ],
        },
      ],
    },
  },
  '/api/4/user/profile/service/retrieve.php': {
    data: { tid: 367454, service: 'DEN' },
    success: true,
  },
  '/api/4/user/bookmark/retrieve.php': {
    success: true,
    data: [],
  },
  '/api/4/offer/search.php': {
    data: [
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 10% off full price',
        companyname: 'Nike',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1717082575822.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 10% on full price in-store',
        companyname: 'Schuh',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1635843888976.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 10% on full price',
        companyname: 'JD Sports',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1725977530158.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Offer boost... Save 20% on full price online',
        companyname: 'Foot Asylum',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1724052909451.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Receive 10% off in store!',
        companyname: 'Office',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/companyimages/complarge/retina/384.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 12% on New Balance 550',
        companyname: 'New Balance',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1713356526610.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 10% online! Including sale',
        companyname: 'Office',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1716977047166.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 10% on full price online',
        companyname: 'Schuh',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1727865857038.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 7% with Baby Planet',
        companyname: 'Baby Planet',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1645802184963.jpg',
      },
      {
        id: 13585,
        catid: 0,
        compid: 382,
        typeid: 0,
        offername: 'Save 20% on full price online',
        companyname: 'Sweaty Betty',
        logos: '',
        absoluteLogos: '',
        s3logos:
          'https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=3840,quality=75,format=webp/https://cdn.bluelightcard.co.uk/offerimages/1722591690945.jpg',
      },
    ],
    success: true,
    message: 'Found',
  },
};

export default legacyMocks;
