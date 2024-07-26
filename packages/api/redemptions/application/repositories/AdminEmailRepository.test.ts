import { faker } from '@faker-js/faker';

import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { AdminEmailRepository, SendVaultThresholdEmailCommandParams } from './AdminEmailRepository';

describe('AdminEmailRepository', () => {
  beforeEach(() => {
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM] = 'test';
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM];
  });

  function getAdminEmailRepository(sesClientProvider: ISesClientProvider) {
    const logger = createTestLogger();
    return new AdminEmailRepository(logger, sesClientProvider);
  }

  it('should send email to the admin', async () => {
    // Arrange
    const sendVaultThresholdEmailData: SendVaultThresholdEmailCommandParams = {
      alertBelow: faker.number.int(100),
      companyName: faker.company.name(),
      offerId: faker.number.int(9999),
      offerName: faker.commerce.productName(),
      recipient: faker.internet.email(),
      remainingCodes: faker.number.int(100),
      thresholdPercentage: faker.number.int(100),
    };
    const sesClientProvider = {
      getClient: jest.fn().mockReturnValue({
        sendEmail: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ISesClientProvider;
    const adminEmailRepository = getAdminEmailRepository(sesClientProvider);
    jest.spyOn(adminEmailRepository, 'sendVaultThresholdEmail');
    // Act
    const result = await adminEmailRepository.sendVaultThresholdEmail(sendVaultThresholdEmailData);
    // Assert
    expect(result).toBeUndefined();
    expect(adminEmailRepository.sendVaultThresholdEmail).toHaveBeenCalledWith(sendVaultThresholdEmailData);
  });

  it('should throw an error if the email not sent', async () => {
    // Arrange
    const sendVaultThresholdEmailData: SendVaultThresholdEmailCommandParams = {
      alertBelow: faker.number.int(100),
      companyName: faker.company.name(),
      offerId: faker.number.int(9999),
      offerName: faker.commerce.productName(),
      recipient: faker.internet.email(),
      remainingCodes: faker.number.int(100),
      thresholdPercentage: faker.number.int(100),
    };
    const sesClientProvider: ISesClientProvider = {
      getClient: jest.fn().mockReturnValue({
        sendEmail: jest.fn().mockRejectedValue(new Error('Email not sent')),
      }),
    };
    const adminEmailRepository = getAdminEmailRepository(sesClientProvider);
    jest.spyOn(adminEmailRepository, 'sendVaultThresholdEmail');
    // Act & Assert
    await expect(() => adminEmailRepository.sendVaultThresholdEmail(sendVaultThresholdEmailData)).rejects.toThrow();
  });
});
