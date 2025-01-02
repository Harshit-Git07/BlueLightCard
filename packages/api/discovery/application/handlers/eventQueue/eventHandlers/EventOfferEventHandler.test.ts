import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { updateEventInMenus } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import {
  deleteEvent,
  getEventById,
  insertEvent,
} from '@blc-mono/discovery/application/repositories/Offer/service/EventService';

import * as target from './EventOfferEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Offer/service/EventService');
jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');

const getByIdMock = jest.mocked(getEventById);
const insertMock = jest.mocked(insertEvent);
const deleteMock = jest.mocked(deleteEvent);
const updateInMenusMock = jest.mocked(updateEventInMenus);

describe('EventEventHandler', () => {
  const loggerSpy = jest.spyOn(LambdaLogger.prototype, 'info');

  describe('handleEventUpdated', () => {
    it('should insert event record if no current record', async () => {
      const newRecord = eventFactory.build({
        updatedAt: new Date(2022, 1, 2).toISOString(),
      });
      getByIdMock.mockResolvedValue(undefined);

      await target.handleEventOfferUpdated(newRecord);

      expect(insertMock).toHaveBeenCalledWith(newRecord);
      expect(updateInMenusMock).toHaveBeenCalledWith(newRecord);
    });

    describe('and current record exists', () => {
      const currentRecord = eventFactory.build({
        updatedAt: new Date(2022, 1, 1).toISOString(),
      });

      beforeEach(() => {
        getByIdMock.mockResolvedValue(currentRecord);
      });

      it('should insert event record if offer record is newer version', async () => {
        const newRecord = eventFactory.build({
          updatedAt: new Date(2022, 1, 2).toISOString(),
        });

        await target.handleEventOfferUpdated(newRecord);

        expect(insertMock).toHaveBeenCalledWith(newRecord);
        expect(updateInMenusMock).toHaveBeenCalledWith(newRecord);
      });

      it('should not insert event record if event record is not newer version', async () => {
        const newRecord = eventFactory.build({
          updatedAt: new Date(2021, 12, 30).toISOString(),
        });

        await target.handleEventOfferUpdated(newRecord);

        expect(insertMock).not.toHaveBeenCalledWith(newRecord);
        expect(updateInMenusMock).not.toHaveBeenCalledWith(newRecord);

        expect(loggerSpy).toHaveBeenCalledWith({
          message: `Event record with id: [${newRecord.id}] is not newer than current stored record, so will not be overwritten.`,
        });
      });
    });
  });

  describe('handleEventOfferDeleted', () => {
    it('should not delete record if no current record exists', async () => {
      const deleteRecord = eventFactory.build();
      getByIdMock.mockResolvedValue(undefined);

      await target.handleEventOfferDeleted(deleteRecord);

      expect(deleteMock).not.toHaveBeenCalledWith(deleteRecord);
      expect(loggerSpy).toHaveBeenCalledWith({
        message: `Event record with id: [${deleteRecord.id}] does not exist, so cannot be deleted.`,
      });
    });

    describe('and current record exists', () => {
      const currentRecord = eventFactory.build({
        updatedAt: new Date(2022, 1, 1).toISOString(),
      });

      beforeEach(() => {
        getByIdMock.mockResolvedValue(currentRecord);
      });

      it('should delete event record if delete event record is newer version', async () => {
        const deleteRecord = eventFactory.build({
          updatedAt: new Date(2022, 1, 2).toISOString(),
        });

        await target.handleEventOfferUpdated(deleteRecord);

        expect(insertMock).toHaveBeenCalledWith(deleteRecord);
      });

      it('should not delete event record if delete event record is not newer version', async () => {
        const deleteRecord = eventFactory.build({
          updatedAt: new Date(2021, 12, 30).toISOString(),
        });

        await target.handleEventOfferUpdated(deleteRecord);

        expect(insertMock).not.toHaveBeenCalledWith(deleteRecord);
        expect(loggerSpy).toHaveBeenCalledWith({
          message: `Event record with id: [${deleteRecord.id}] is not newer than current stored record, so will not be overwritten.`,
        });
      });
    });
  });
});
