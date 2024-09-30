import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { IRedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import {
  PromotionUpdateResults,
  PromotionUpdateService,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { promotionsUpdatedEventFactory } from '@blc-mono/redemptions/libs/test/factories/promotionsEvents.factory';
import { vaultItemFactory } from '@blc-mono/redemptions/libs/test/factories/vaultItem.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

describe('PromotionUpdateService', () => {
  it('Updates the correct redemptions by their offer IDs', async () => {
    // Arrange
    const event = promotionsUpdatedEventFactory.build();
    const logger = createTestLogger();
    const mockLegacyVaultApiRepository = {
      assignCodeToMember: jest.fn(),
      assignCodeToMemberWithErrorHandling: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getNumberOfCodesIssuedByMember: jest.fn(),
      getCodesRedeemed: jest.fn(),
      checkVaultStock: jest.fn(),
      viewVaultBatches: jest.fn(),
    } satisfies ILegacyVaultApiRepository;
    const mockRedemptionConfigRepository = {
      createRedemption: jest.fn(),
      findOneById: jest.fn(),
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      withTransaction: jest.fn(),
      updateOneById: jest.fn(),
    } satisfies IRedemptionConfigRepository;

    const service = new PromotionUpdateService(logger, mockLegacyVaultApiRepository, mockRedemptionConfigRepository);

    const vaultItems = vaultItemFactory.buildList(2);
    mockLegacyVaultApiRepository.findVaultsRelatingToLinkId.mockReturnValue(vaultItems);
    mockRedemptionConfigRepository.updateManyByOfferId.mockResolvedValue([
      { offerId: vaultItems[0].offerId },
      { offerId: vaultItems[1].offerId },
    ]);

    // Act
    const response = await service.handlePromotionUpdate(event);

    // Assert
    expect(response.kind).toEqual(PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS);
    expect(mockRedemptionConfigRepository.updateManyByOfferId).toHaveBeenCalledWith(
      [vaultItems[0].offerId, vaultItems[1].offerId],
      expect.any(Object),
    );
  });

  it.todo('Correctly maps the event data');
});
