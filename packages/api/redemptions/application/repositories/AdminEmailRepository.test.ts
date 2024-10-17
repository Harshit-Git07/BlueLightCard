import { SESClient } from '@aws-sdk/client-ses';
import { faker } from '@faker-js/faker';
import { mockClient } from 'aws-sdk-client-mock';

import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import {
  AdminEmailRepository,
  SendVaultThresholdEmailCommandParams,
  VaultBatchCreatedEmailParams,
} from './AdminEmailRepository';

describe('AdminEmailRepository', () => {
  beforeEach(() => {
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM] = 'test';
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM];
  });

  function getAdminEmailRepository(sesClientProvider: ISesClientProvider) {
    const logger = createSilentLogger();
    return new AdminEmailRepository(logger, sesClientProvider);
  }

  const vaultBatchCreatedEmailParams = {
    adminEmail: faker.internet.email(),
    vaultId: `vlt-${faker.string.uuid()}`,
    batchId: `vbt-${faker.string.uuid()}`,
    fileName: 'test.json',
    countCodeInsertSuccess: 10,
    countCodeInsertFail: 2,
    codeInsertFailArray: ['code_1', 'code_2'],
  } satisfies VaultBatchCreatedEmailParams;

  it('should send email to the admin', async () => {
    // Arrange
    const sendVaultThresholdEmailData: SendVaultThresholdEmailCommandParams = {
      alertBelow: faker.number.int(100),
      companyName: faker.company.name(),
      offerId: faker.string.uuid(),
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
      offerId: faker.string.uuid(),
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

  it('should send admin email for vault batch created', async () => {
    // Arrange
    const mockSesClientProvider = {
      getClient: jest.fn().mockReturnValue(
        mockClient(SESClient)
          .onAnyCommand()
          .resolves({
            $metadata: {
              httpStatusCode: 200,
              requestId: 'cc353dd4-4fb0-49d0-867d-7d0db59ef249',
              attempts: 1,
              totalRetryDelay: 0,
            },
            MessageId: '010b01907da6cfb9-9fc5704d-e8e5-4544-975e-11f24248b571-000000',
          }),
      ),
    } as unknown as ISesClientProvider;

    const adminEmailRepository = getAdminEmailRepository(mockSesClientProvider);
    jest.spyOn(adminEmailRepository, 'sendVaultBatchCreatedEmail');

    // Act
    const result = await adminEmailRepository.sendVaultBatchCreatedEmail(vaultBatchCreatedEmailParams);
    // Assert
    expect(result).toBeUndefined();
    expect(adminEmailRepository.sendVaultBatchCreatedEmail).toHaveBeenCalledWith(vaultBatchCreatedEmailParams);
  });

  it('should fail to send admin email for vault batch created', async () => {
    // Arrange
    const mockSesClientProvider: ISesClientProvider = {
      getClient: jest.fn().mockReturnValue({
        sendEmail: jest.fn().mockRejectedValue(new Error('Failed to send BLC vault codes uploaded admin email')),
      }),
    };

    const adminEmailRepository = getAdminEmailRepository(mockSesClientProvider);
    jest.spyOn(adminEmailRepository, 'sendVaultBatchCreatedEmail');

    // Act and Assert
    await expect(() => adminEmailRepository.sendVaultBatchCreatedEmail(vaultBatchCreatedEmailParams)).rejects.toThrow();
  });
});
