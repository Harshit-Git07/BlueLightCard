import { faker } from '@faker-js/faker';

import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { redeemParamsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemParams.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultDetailsFactory } from '@blc-mono/redemptions/libs/test/factories/vaultDetails.factory';

import { RedeemParams, VaultDetails } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';

const memberRedemptionEventDetailBuilder: MemberRedemptionEventDetailBuilder = new MemberRedemptionEventDetailBuilder();

const params: RedeemParams = redeemParamsFactory.build();
const url: string = faker.internet.url();
const code: string = faker.string.alphanumeric(10);
const vaultDetails: VaultDetails = vaultDetailsFactory.build();

describe('buildMemberRedemptionEventDetail', () => {
  it('throws an error if redemptionType is vaultQR and there is no code', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vaultQR',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
        vaultDetails,
      }),
    ).toThrow('Code is required to build a vaultQR MemberRedemptionEventDetail');
  });

  it('builds a vaultQR MemberRedemptionEventDetail', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vaultQR',
    });

    const actualMemberRedemptionEventDetail: MemberRedemptionEventDetail =
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
        code,
        vaultDetails,
      });

    const expectedMemberRedemptionEventDetail: MemberRedemptionEventDetail = {
      memberDetails: {
        memberId: params.memberId,
        brazeExternalUserId: params.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: redemptionConfigEntity.id,
        companyId: redemptionConfigEntity.companyId,
        companyName: params.companyName,
        offerId: redemptionConfigEntity.offerId,
        offerName: params.offerName,
        affiliate: redemptionConfigEntity.affiliate,
        clientType: params.clientType,
        redemptionType: 'vaultQR',
        code,
        url,
        vaultDetails,
      },
    };

    expect(actualMemberRedemptionEventDetail).toEqual(expectedMemberRedemptionEventDetail);
  });

  it('throws error if redemptionType is vault and there is no url', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        code,
        vaultDetails,
      }),
    ).toThrow('Url is required to build a vault MemberRedemptionEventDetail');
  });

  it('throws error if redemptionType is vault and there is no code', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
        vaultDetails,
      }),
    ).toThrow('Code is required to build a vault MemberRedemptionEventDetail');
  });

  it('builds a vault MemberRedemptionEventDetail', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });

    const actualMemberRedemptionEventDetail: MemberRedemptionEventDetail =
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
        code,
        vaultDetails,
      });

    const expectedMemberRedemptionEventDetail: MemberRedemptionEventDetail = {
      memberDetails: {
        memberId: params.memberId,
        brazeExternalUserId: params.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: redemptionConfigEntity.id,
        companyId: redemptionConfigEntity.companyId,
        companyName: params.companyName,
        offerId: redemptionConfigEntity.offerId,
        offerName: params.offerName,
        affiliate: redemptionConfigEntity.affiliate,
        clientType: params.clientType,
        redemptionType: 'vault',
        code,
        url,
        vaultDetails,
      },
    };

    expect(actualMemberRedemptionEventDetail).toEqual(expectedMemberRedemptionEventDetail);
  });

  it('throws error if redemptionType is generic and there is no url', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        code,
      }),
    ).toThrow('Url is required to build a generic MemberRedemptionEventDetail');
  });

  it('throws error if redemptionType is generic and there is no code', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
      }),
    ).toThrow('Code is required to build a generic MemberRedemptionEventDetail');
  });

  it('builds a generic MemberRedemptionEventDetail', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    const actualMemberRedemptionEventDetail: MemberRedemptionEventDetail =
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
        code,
      });

    const expectedMemberRedemptionEventDetail: MemberRedemptionEventDetail = {
      memberDetails: {
        memberId: params.memberId,
        brazeExternalUserId: params.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: redemptionConfigEntity.id,
        companyId: redemptionConfigEntity.companyId,
        companyName: params.companyName,
        offerId: redemptionConfigEntity.offerId,
        offerName: params.offerName,
        affiliate: redemptionConfigEntity.affiliate,
        clientType: params.clientType,
        redemptionType: 'generic',
        code,
        url,
      },
    };

    expect(actualMemberRedemptionEventDetail).toEqual(expectedMemberRedemptionEventDetail);
  });

  it('builds a showCard MemberRedemptionEventDetail', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'showCard',
    });

    const actualMemberRedemptionEventDetail: MemberRedemptionEventDetail =
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
      });

    const expectedMemberRedemptionEventDetail: MemberRedemptionEventDetail = {
      memberDetails: {
        memberId: params.memberId,
        brazeExternalUserId: params.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: redemptionConfigEntity.id,
        companyId: redemptionConfigEntity.companyId,
        companyName: params.companyName,
        offerId: redemptionConfigEntity.offerId,
        offerName: params.offerName,
        affiliate: redemptionConfigEntity.affiliate,
        clientType: params.clientType,
        redemptionType: 'showCard',
      },
    };

    expect(actualMemberRedemptionEventDetail).toEqual(expectedMemberRedemptionEventDetail);
  });

  it('builds a preApplied MemberRedemptionEventDetail', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'preApplied',
    });

    const actualMemberRedemptionEventDetail: MemberRedemptionEventDetail =
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        url,
      });

    const expectedMemberRedemptionEventDetail: MemberRedemptionEventDetail = {
      memberDetails: {
        memberId: params.memberId,
        brazeExternalUserId: params.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: redemptionConfigEntity.id,
        companyId: redemptionConfigEntity.companyId,
        companyName: params.companyName,
        offerId: redemptionConfigEntity.offerId,
        offerName: params.offerName,
        affiliate: redemptionConfigEntity.affiliate,
        clientType: params.clientType,
        redemptionType: 'preApplied',
        url,
      },
    };

    expect(actualMemberRedemptionEventDetail).toEqual(expectedMemberRedemptionEventDetail);
  });

  it('throws error if redemptionType is preApplied and there is no url', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'preApplied',
    });

    expect(() =>
      memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        code,
      }),
    ).toThrow('Url is required to build a preApplied MemberRedemptionEventDetail');
  });
});
