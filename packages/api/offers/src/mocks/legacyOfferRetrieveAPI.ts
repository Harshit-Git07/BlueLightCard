import { faker } from '@faker-js/faker';

// not providing overrides for mocked offer as of now.
// at the moment it would be an overkill to override for a specific indexed offer object
// this function mocks the offer object that is retrieved as part of the response from the legacy API
function mockedOffer() {
  return {
    id: faker.number.int(),
    typeid: faker.number.int(),
    name: faker.lorem.words(),
    desc: faker.lorem.sentences(3),
    terms: faker.lorem.sentences(3),
    code: faker.lorem.slug(),
    expires: faker.date.future(),
    button: faker.lorem.word(),
    imageoffer: faker.internet.url(),
    absoluteimageoffer: faker.internet.url(),
    s3imageoffer: faker.internet.url(),
    openmethod: faker.number.int(),
    reqcard: faker.number.int(),
    vault: faker.number.int(),
    cardaction: faker.number.int(),
  };
}

// this function mocks the response from the legacy API GET <baseUrl>/api/4/offer/retrieve.php
export function mockLegacyOfferRetrieveAPI(offersCount: number, overrides: Record<string, any> = {}) {
  const dataSource = faker.helpers.arrayElement(['memcache', 'db fallback']);
  const dataOverrideLevel1 = overrides?.data || {};
  let dataOverrideLevel2 = {};
  if (overrides.data && overrides?.data.data) {
    dataOverrideLevel2 = overrides.data.data;
    delete overrides.data.data;
  }
  if (overrides.data) {
    delete overrides.data;
  }
  return {
    data: {
      offerCompSource: dataSource,
      success: true,
      message: 'Found',
      datasource: dataSource,
      data: {
        id: faker.number.int(),
        offers: Array.from({ length: offersCount }, mockedOffer),
        name: faker.lorem.words({ min: 1, max: 3 }),
        summary: faker.lorem.sentences(2),
        legalurl: faker.internet.url(),
        logos: faker.system.fileName(),
        absolutelogos: faker.internet.url(),
        s3logos: faker.internet.url(),
        ...dataOverrideLevel2,
      },
      ...dataOverrideLevel1,
    },
    headers: {},
    status: 200,
    statusText: '',
    config: {
      headers: {},
    },
    ...overrides,
  };
}
