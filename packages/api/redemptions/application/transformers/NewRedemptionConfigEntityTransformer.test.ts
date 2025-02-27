import { faker } from '@faker-js/faker/locale/af_ZA';

import { as } from '@blc-mono/core/utils/testing';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { NewRedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';

import { NewRedemptionConfigEntityTransformer } from './NewRedemptionConfigEntityTransformer';

const newRedemptionConfigEntityTransformer = new NewRedemptionConfigEntityTransformer();

const showCardRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'showCard',
};

const vaultQRRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'affiliate',
  redemptionType: 'vaultQR',
  affiliate: 'affiliateFuture',
  vault: {
    status: 'active',
    alertBelow: faker.number.int(),
    maxPerUser: faker.number.int(),
    email: faker.internet.email(),
    integration: 'eagleeye',
    integrationId: faker.string.uuid(),
  },
};

const preAppliedRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'preApplied',
  url: 'www.url.com',
};

const vaultRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'affiliate',
  redemptionType: 'vault',
  affiliate: 'affiliateFuture',
  url: faker.internet.url(),
  vault: {
    status: 'active',
    alertBelow: faker.number.int(),
    maxPerUser: faker.number.int(),
    email: faker.internet.email(),
    integration: 'eagleeye',
    integrationId: faker.string.uuid(),
  },
};

const genericRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'affiliate',
  redemptionType: 'generic',
  affiliate: 'affiliateFuture',
  url: faker.internet.url(),
  generic: {
    code: 'BLC10OFF',
  },
};

const giftCardRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'giftCard',
  affiliate: 'awin',
  url: 'www.url.com',
};

const compareRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'compare',
  affiliate: 'awin',
  url: 'www.url.com',
};

const verifyRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'verify',
  affiliate: 'awin',
  url: 'www.url.com',
};

const ballotRequestBody: PostRedemptionConfigModel = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'affiliate',
  redemptionType: 'ballot',
  affiliate: 'affiliateFuture',
  url: faker.internet.url(),
  ballot: {
    totalTickets: faker.number.int(),
    drawDate: faker.date.future().toISOString(),
    eventDate: faker.date.future().toISOString(),
    offerName: faker.lorem.word(),
  },
};

describe('transformToNewRedemptionConfigEntity', () => {
  it.each([
    ['showCard' as const, showCardRequestBody],
    ['vaultQR' as const, vaultQRRequestBody],
  ])('maps %s to "in-store" offerType', (redemptionType, redemptionConfigRequestBody) => {
    const actualNewRedemptionConfigEntity: NewRedemptionConfigEntity =
      newRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity(redemptionConfigRequestBody);

    const expectedNewRedemptionConfigEntity: NewRedemptionConfigEntity = {
      companyId: redemptionConfigRequestBody.companyId,
      offerId: redemptionConfigRequestBody.offerId,
      offerType: 'in-store',
      connection: redemptionConfigRequestBody.connection,
      redemptionType: redemptionType,
      affiliate: redemptionConfigRequestBody?.affiliate,
    } as const;

    expect(actualNewRedemptionConfigEntity).toStrictEqual(expectedNewRedemptionConfigEntity);
  });

  it.each([
    ['preApplied' as const, preAppliedRequestBody],
    ['vault' as const, vaultRequestBody],
    ['generic' as const, genericRequestBody],
    ['giftCard' as const, giftCardRequestBody],
    ['compare' as const, compareRequestBody],
    ['verify' as const, verifyRequestBody],
    ['ballot' as const, ballotRequestBody],
  ])('maps %s to "online" offerType', (redemptionType, redemptionConfigRequestBody) => {
    const expectedNewRedemptionConfigEntity: NewRedemptionConfigEntity = {
      companyId: redemptionConfigRequestBody.companyId,
      offerId: redemptionConfigRequestBody.offerId,
      offerType: 'online',
      connection: redemptionConfigRequestBody.connection,
      redemptionType: redemptionType,
      affiliate: redemptionConfigRequestBody?.affiliate,
      url: redemptionConfigRequestBody.url,
    } as const;

    const actualNewRedemptionConfigEntity: NewRedemptionConfigEntity =
      newRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity(redemptionConfigRequestBody);

    expect(actualNewRedemptionConfigEntity).toStrictEqual(expectedNewRedemptionConfigEntity);
  });

  it('throws an error when an unsupported redemptionType is provided', () => {
    const redemptionConfigRequestBody: PostRedemptionConfigModel = {
      companyId: faker.string.uuid(),
      offerId: faker.string.uuid(),
      connection: 'none',
      redemptionType: as('invalidRedemptionType'),
    } as PostRedemptionConfigModel;

    expect(() =>
      newRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity(redemptionConfigRequestBody),
    ).toThrow();
  });
});
