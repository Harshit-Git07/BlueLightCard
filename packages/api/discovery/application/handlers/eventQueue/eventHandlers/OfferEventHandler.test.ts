import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import {
  deleteOffer,
  getOfferById,
  insertOffer,
} from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import * as target from './OfferEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');

const getOfferByIdMock = jest.mocked(getOfferById);
const insertOfferMock = jest.mocked(insertOffer);
const deleteOfferMock = jest.mocked(deleteOffer);

describe('OfferEventHandler', () => {
  const loggerSpy = jest.spyOn(LambdaLogger.prototype, 'info');

  describe('handleOfferUpdated', () => {
    it('should insert offer record if no current record', async () => {
      const newOfferRecord = offerFactory.build({
        updatedAt: new Date(2022, 1, 2).toISOString(),
      });
      getOfferByIdMock.mockResolvedValue(undefined);

      await target.handleOfferUpdated(newOfferRecord);

      expect(insertOfferMock).toHaveBeenCalledWith(newOfferRecord);
    });

    describe('and current record exists', () => {
      const currentOfferRecord = offerFactory.build({
        updatedAt: new Date(2022, 1, 1).toISOString(),
      });

      beforeEach(() => {
        getOfferByIdMock.mockResolvedValue(currentOfferRecord);
      });

      it('should insert offer record if offer record is newer version', async () => {
        const newOfferRecord = offerFactory.build({
          updatedAt: new Date(2022, 1, 2).toISOString(),
        });

        await target.handleOfferUpdated(newOfferRecord);

        expect(insertOfferMock).toHaveBeenCalledWith(newOfferRecord);
      });

      it('should not insert offer record if offer record is not newer version', async () => {
        const newOfferRecord = offerFactory.build({
          updatedAt: new Date(2021, 12, 30).toISOString(),
        });

        await target.handleOfferUpdated(newOfferRecord);

        expect(insertOfferMock).not.toHaveBeenCalledWith(newOfferRecord);
        expect(loggerSpy).toHaveBeenCalledWith({
          message: `Offer record with id: [${newOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
        });
      });
    });
  });

  describe('handleOfferDeleted', () => {
    it('should not delete record if no current record exists', async () => {
      const deleteOfferRecord = offerFactory.build();
      getOfferByIdMock.mockResolvedValue(undefined);

      await target.handleOfferDeleted(deleteOfferRecord);

      expect(deleteOfferMock).not.toHaveBeenCalledWith(deleteOfferRecord);
      expect(loggerSpy).toHaveBeenCalledWith({
        message: `Offer record with id: [${deleteOfferRecord.id}] does not exist, so cannot be deleted.`,
      });
    });

    describe('and current record exists', () => {
      const currentOfferRecord = offerFactory.build({
        updatedAt: new Date(2022, 1, 1).toISOString(),
      });

      beforeEach(() => {
        getOfferByIdMock.mockResolvedValue(currentOfferRecord);
      });

      it('should delete offer record if delete offer record is newer version', async () => {
        const deleteOfferRecord = offerFactory.build({
          updatedAt: new Date(2022, 1, 2).toISOString(),
        });

        await target.handleOfferUpdated(deleteOfferRecord);

        expect(insertOfferMock).toHaveBeenCalledWith(deleteOfferRecord);
      });

      it('should not delete offer record if delete offer record is not newer version', async () => {
        const deleteOfferRecord = offerFactory.build({
          updatedAt: new Date(2021, 12, 30).toISOString(),
        });

        await target.handleOfferUpdated(deleteOfferRecord);

        expect(insertOfferMock).not.toHaveBeenCalledWith(deleteOfferRecord);
        expect(loggerSpy).toHaveBeenCalledWith({
          message: `Offer record with id: [${deleteOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
        });
      });
    });
  });
});
