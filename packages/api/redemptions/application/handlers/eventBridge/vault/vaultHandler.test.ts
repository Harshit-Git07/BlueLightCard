import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';

import { createSilentLogger, createTestLogger } from '../../../test/helpers/logger';
import { VaultEvents } from '../events';

import { createHandler } from './vaultHandler';

function createTestDatabaseConnection() {
  return {
    db: {
      execute: jest.fn(),
    },
  };
}

describe('vaultHandler', () => {
  it('should call the vaultCreatedHandler when the event source is VAULT_CREATED', async () => {
    // Arrange
    const vaultCreatedHandler = jest.fn();
    const vaultUpdatedHandler = jest.fn();
    const logger = createTestLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, vaultCreatedHandler, vaultUpdatedHandler);

    // Act
    await handler(as(connection), as({ source: VaultEvents.VAULT_CREATED }));

    // Assert
    expect(vaultCreatedHandler).toHaveBeenCalled();
    expect(vaultUpdatedHandler).not.toHaveBeenCalled();
  });

  it('should call the vaultCreatedHandler when the event source is VAULT_CREATED', async () => {
    // Arrange
    const vaultCreatedHandler = jest.fn();
    const vaultUpdatedHandler = jest.fn();
    const logger = createTestLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, vaultCreatedHandler, vaultUpdatedHandler);

    // Act
    await handler(as(connection), as({ source: VaultEvents.VAULT_UPDATED }));

    // Assert
    expect(vaultCreatedHandler).not.toHaveBeenCalled();
    expect(vaultUpdatedHandler).toHaveBeenCalled();
  });

  it('should throw an error when the event source is invalid', async () => {
    // Arrange
    const vaultCreatedHandler = jest.fn();
    const vaultUpdatedHandler = jest.fn();
    const logger = createSilentLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, vaultCreatedHandler, vaultUpdatedHandler);

    // Act
    const act = async () => await handler(as(connection), as({ source: 'invalid' }));

    // Assert
    await expect(act).rejects.toThrow('Invalid event source');
  });
});
