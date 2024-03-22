import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { IRedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import {
  PromotionUpdateResults,
  PromotionUpdateService,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { promotionsUpdatedEventFactory } from '@blc-mono/redemptions/application/test/factories/promotionsEvents.factory';
import { vaultItemFactory } from '@blc-mono/redemptions/application/test/factories/vaultItem.factory';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';

describe('PromotionUpdateService', () => {
  it('Updates the correct redemptions by their offer IDs', async () => {
    // Arrange
    const event = promotionsUpdatedEventFactory.build();
    const logger = createTestLogger();
    const legacyVaultApiRepository = {
      assignCodeToMember: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getNumberOfCodesIssued: jest.fn(),
      getCodesRedeemed: jest.fn(),
    } satisfies ILegacyVaultApiRepository;
    const redemptionsRepository = {
      createRedemption: jest.fn(),
      findOneByOfferId: jest.fn(),
      updateOneByOfferId: jest.fn(),
      updateManyByOfferId: jest.fn(),
      withTransaction: jest.fn(),
    } satisfies IRedemptionsRepository;
    const service = new PromotionUpdateService(logger, legacyVaultApiRepository, redemptionsRepository);
    const vaultItems = vaultItemFactory.buildList(2);
    legacyVaultApiRepository.findVaultsRelatingToLinkId.mockReturnValue(vaultItems);
    redemptionsRepository.updateManyByOfferId.mockResolvedValue([
      { offerId: vaultItems[0].offerId },
      { offerId: vaultItems[1].offerId },
    ]);

    // Act
    const response = await service.handlePromotionUpdate(event);

    // Assert
    expect(response.kind).toEqual(PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS);
    expect(redemptionsRepository.updateManyByOfferId).toHaveBeenCalledWith(
      [vaultItems[0].offerId, vaultItems[1].offerId],
      expect.any(Object),
    );
  });

  it.todo('Correctly maps the event data');
});
