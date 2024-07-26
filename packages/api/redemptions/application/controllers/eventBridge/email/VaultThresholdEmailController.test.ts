import { IVaultThresholdService } from '@blc-mono/redemptions/application/services/vault/VaultThresholdService';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { VaultThresholdEmailController } from './VaultThresholdEmailController';

describe('VaultThresholdEmailController', () => {
  it('should send email for vault threshold events', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockVaultThresholdService = {
      handleVaultThresholdEmail: jest.fn().mockResolvedValue(undefined),
    } satisfies IVaultThresholdService;
    const event = memberRedemptionEventFactory.build();
    const controller = new VaultThresholdEmailController(logger, mockVaultThresholdService);

    // Act
    await controller.handle(event);

    // Assert
    expect(mockVaultThresholdService.handleVaultThresholdEmail).toHaveBeenCalledWith(event.detail);
  });

  it('should throw an error if the email not sent', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockVaultThresholdService = {
      handleVaultThresholdEmail: jest.fn().mockRejectedValue(new Error('Email not sent')),
    } satisfies IVaultThresholdService;
    const event = memberRedemptionEventFactory.build();
    const controller = new VaultThresholdEmailController(logger, mockVaultThresholdService);

    // Act & Assert
    await expect(() => controller.handle(event)).rejects.toThrow();
  });
});
