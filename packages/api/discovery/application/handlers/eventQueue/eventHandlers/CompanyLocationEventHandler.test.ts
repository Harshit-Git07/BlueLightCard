import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { companyLocationFactory } from '@blc-mono/discovery/application/factories/CompanyLocationFactory';
import { handleCompanyLocationsUpdateToCompanies } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/handleCompanyLocationsUpdateToCompanies';
import { CompanyLocationEvent } from '@blc-mono/discovery/application/models/CompanyLocation';
import {
  getCompanyById,
  insertCompanyLocations,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';

import * as target from './CompanyLocationEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Company/service/CompanyService');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/handleCompanyLocationsUpdateToCompanies');

const getCompanyByIdMock = jest.mocked(getCompanyById);
const insertCompanyLocationsMock = jest.mocked(insertCompanyLocations);
const handleCompanyLocationsMock = jest.mocked(handleCompanyLocationsUpdateToCompanies);

const updatedAtTimeStamp = new Date(2022, 1, 1).toISOString();
const companyRecord = companyFactory.build({ updatedAt: updatedAtTimeStamp });

const companyLocation = companyLocationFactory.build({ updatedAt: updatedAtTimeStamp });

const companyLocationEvent: CompanyLocationEvent = {
  companyId: companyLocation.companyId,
  locations: [companyLocation],
  updatedAt: companyLocation.updatedAt,
  batchIndex: companyLocation.batchIndex,
  totalBatches: companyLocation.totalBatches,
};

describe('CompanyLocationEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCompanyLocationsUpdated', () => {
    handleCompanyLocationsMock.mockResolvedValue({ companyRecordUpdated: true });

    describe('and no company record', () => {
      it('should insert company locations successfully', async () => {
        getCompanyByIdMock.mockResolvedValue(undefined);
        await target.handleCompanyLocationsUpdated(companyLocationEvent);

        expect(insertCompanyLocationsMock).toHaveBeenCalledWith(companyLocationEvent.locations);
        expect(handleCompanyLocationsMock).not.toHaveBeenCalled();
      });
    });

    describe('and company record exists', () => {
      it('should insert company locations successfully if newer', async () => {
        getCompanyByIdMock.mockResolvedValue(companyRecord);
        const newerCompanyLocationEvent = { ...companyLocationEvent, updatedAt: new Date(2023, 1, 1).toISOString() };
        await target.handleCompanyLocationsUpdated(newerCompanyLocationEvent);
        expect(insertCompanyLocationsMock).toHaveBeenCalledWith(companyLocationEvent.locations);
        expect(handleCompanyLocationsMock).toHaveBeenCalledWith(companyRecord);
      });

      it('should insert the company location if the company is the same updatedAt', async () => {
        getCompanyByIdMock.mockResolvedValue(companyRecord);
        await target.handleCompanyLocationsUpdated(companyLocationEvent);
        expect(insertCompanyLocationsMock).toHaveBeenCalledWith(companyLocationEvent.locations);
        expect(handleCompanyLocationsMock).toHaveBeenCalled();
      });

      it('should not insert company locations if older', async () => {
        await target.handleCompanyLocationsUpdated({ ...companyLocationEvent, updatedAt: '2021-09-01T00:00:00' });
        expect(insertCompanyLocationsMock).not.toHaveBeenCalled();
        expect(handleCompanyLocationsMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('isAllCompanyLocationBatchesSaved', () => {
    const companyLocation = companyLocationFactory.build();
    it('should return false if no company locations', () => {
      expect(target.isAllCompanyLocationBatchesSaved([])).toBe(false);
    });

    const truthyTestCases = [
      {
        companyLocations: [
          { ...companyLocation, batchIndex: 0, totalBatches: 1 },
          { ...companyLocation, batchIndex: 0, totalBatches: 1 },
        ],
      },
      {
        companyLocations: [
          { ...companyLocation, batchIndex: 0, totalBatches: 2 },
          { ...companyLocation, batchIndex: 1, totalBatches: 2 },
        ],
      },
      {
        companyLocations: [
          { ...companyLocation, batchIndex: 0, totalBatches: 3 },
          { ...companyLocation, batchIndex: 0, totalBatches: 3 },
          { ...companyLocation, batchIndex: 1, totalBatches: 3 },
          { ...companyLocation, batchIndex: 2, totalBatches: 3 },
          { ...companyLocation, batchIndex: 2, totalBatches: 3 },
          { ...companyLocation, batchIndex: 2, totalBatches: 3 },
        ],
      },
    ];

    it.each(truthyTestCases)(
      'should return true if the unique count of batch indices matches the total batch size',
      ({ companyLocations }) => {
        expect(target.isAllCompanyLocationBatchesSaved(companyLocations)).toBeTruthy();
      },
    );
  });

  describe('sortCurrentStoredCompanyLocationEvents', () => {
    const companyLocation = companyLocationFactory.build();
    const companyRecord = companyFactory.build({ updatedAt: new Date(2022, 1, 1).toISOString() });
    const oldCompanyLocation = { ...companyLocation, updatedAt: new Date(2021, 1, 2).toISOString() };
    const newCompanyLocation = { ...companyLocation, updatedAt: new Date(2023, 1, 2).toISOString() };

    const testCases = [
      {
        companyLocations: [oldCompanyLocation, newCompanyLocation],
        expectedOldEvents: [oldCompanyLocation],
        expectedCurrentEvents: [newCompanyLocation],
      },
      {
        companyLocations: [newCompanyLocation, newCompanyLocation],
        expectedOldEvents: [],
        expectedCurrentEvents: [newCompanyLocation, newCompanyLocation],
      },
      {
        companyLocations: [oldCompanyLocation, oldCompanyLocation],
        expectedOldEvents: [oldCompanyLocation, oldCompanyLocation],
        expectedCurrentEvents: [],
      },
    ];

    it.each(testCases)(
      'should return old and current events based on updatedAt',
      ({ companyLocations, expectedCurrentEvents, expectedOldEvents }) => {
        const result = target.sortCurrentStoredCompanyLocationEvents(companyLocations, companyRecord);
        expect(result).toEqual({ oldEvents: expectedOldEvents, currentEvents: expectedCurrentEvents });
      },
    );
  });
});
