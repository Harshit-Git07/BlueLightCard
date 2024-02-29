import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { createSilentLogger, createTestLogger } from '../../../test/helpers/logger';

import { createHandler } from './offerHandler';

function createTestDatabaseConnection() {
  return {
    db: {
      execute: jest.fn(),
    },
  };
}

describe('offerHandler', () => {
  it('should call the offerCreatedHandler when the event source is OFFER_CREATED', async () => {
    // Arrange
    const offerCreatedHandler = jest.fn();
    const offerUpdatedHandler = jest.fn();
    const logger = createTestLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, offerCreatedHandler, offerUpdatedHandler);

    // Act
    await handler(as(connection), as({ source: RedemptionsDatasyncEvents.OFFER_CREATED }));

    // Assert
    expect(offerCreatedHandler).toHaveBeenCalled();
    expect(offerUpdatedHandler).not.toHaveBeenCalled();
  });

  it('should call the offerCreatedHandler when the event source is OFFER_CREATED', async () => {
    // Arrange
    const offerCreatedHandler = jest.fn();
    const offerUpdatedHandler = jest.fn();
    const logger = createTestLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, offerCreatedHandler, offerUpdatedHandler);

    // Act
    await handler(as(connection), as({ source: RedemptionsDatasyncEvents.OFFER_UPDATED }));

    // Assert
    expect(offerCreatedHandler).not.toHaveBeenCalled();
    expect(offerUpdatedHandler).toHaveBeenCalled();
  });

  it('should throw an error when the event source is invalid', async () => {
    // Arrange
    const offerCreatedHandler = jest.fn();
    const offerUpdatedHandler = jest.fn();
    const logger = createSilentLogger();
    const connection = createTestDatabaseConnection();
    const handler = createHandler(logger, offerCreatedHandler, offerUpdatedHandler);

    // Act
    const act = async () => await handler(as(connection), as({ source: 'invalid' }));

    // Assert
    await expect(act).rejects.toThrow('Invalid event source');
  });
});
