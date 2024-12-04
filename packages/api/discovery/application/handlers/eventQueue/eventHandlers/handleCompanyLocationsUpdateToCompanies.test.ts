import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { companyLocationFactory } from '@blc-mono/discovery/application/factories/CompanyLocationFactory';
import {
  deleteCompanyRecords,
  getCompanyLocationsById,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';
import { mapCompanyLocationToLocation } from '@blc-mono/discovery/application/repositories/Company/service/mapper/CompanyMapper';

import { updateCompanyInCompanyAndOffers } from './CompanyEventHandler';
import {
  isAllCompanyLocationBatchesSaved,
  sortCurrentStoredCompanyLocationEvents,
} from './CompanyLocationEventHandler';
import { handleCompanyLocationsUpdateToCompanies } from './handleCompanyLocationsUpdateToCompanies';

jest.mock('@blc-mono/discovery/application/repositories/Company/service/CompanyService');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyLocationEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler');

const getCompanyLocationsByIdMock = jest.mocked(getCompanyLocationsById);
const isAllCompanyLocationBatchesSavedMock = jest.mocked(isAllCompanyLocationBatchesSaved);
const sortCurrentStoredCompanyLocationEventsMock = jest.mocked(sortCurrentStoredCompanyLocationEvents);
const deleteCompanyRecordsMock = jest.mocked(deleteCompanyRecords);
const updateCompanyInCompanyAndOffersMock = jest.mocked(updateCompanyInCompanyAndOffers);

const companyRecord = companyFactory.build();
const companyLocationRecord = companyLocationFactory.build();
const companyLocationRecordTwo = companyLocationFactory.build();

describe('handleCompanyLocationsUpdateToCompanies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('all company location batches are saved', () => {
    it('should update successfully', async () => {
      getCompanyLocationsByIdMock.mockResolvedValue([companyLocationRecord]);
      isAllCompanyLocationBatchesSavedMock.mockReturnValue(true);

      sortCurrentStoredCompanyLocationEventsMock.mockReturnValue({
        oldEvents: [companyLocationRecordTwo],
        currentEvents: [companyLocationRecord],
      });

      const result = await handleCompanyLocationsUpdateToCompanies(companyRecord);

      expect(result).toEqual({ companyRecordUpdated: true });
      expect(getCompanyLocationsByIdMock).toHaveBeenCalledWith(companyRecord.id);
      expect(isAllCompanyLocationBatchesSavedMock).toHaveBeenCalledWith([companyLocationRecord]);
      expect(sortCurrentStoredCompanyLocationEventsMock).toHaveBeenCalledWith([companyLocationRecord], companyRecord);
      expect(deleteCompanyRecordsMock).toHaveBeenCalledWith([companyLocationRecordTwo]);
      expect(updateCompanyInCompanyAndOffersMock).toHaveBeenCalledWith({
        ...companyRecord,
        locations: [companyLocationRecord].map(mapCompanyLocationToLocation),
      });
    });

    it('should not delete old events if there are no old events', async () => {
      getCompanyLocationsByIdMock.mockResolvedValue([companyLocationRecord]);
      isAllCompanyLocationBatchesSavedMock.mockReturnValue(true);

      sortCurrentStoredCompanyLocationEventsMock.mockReturnValue({
        oldEvents: [],
        currentEvents: [companyLocationRecord],
      });

      const result = await handleCompanyLocationsUpdateToCompanies(companyRecord);

      expect(result).toEqual({ companyRecordUpdated: true });
      expect(getCompanyLocationsByIdMock).toHaveBeenCalledWith(companyRecord.id);
      expect(isAllCompanyLocationBatchesSavedMock).toHaveBeenCalledWith([companyLocationRecord]);
      expect(sortCurrentStoredCompanyLocationEventsMock).toHaveBeenCalledWith([companyLocationRecord], companyRecord);
      expect(deleteCompanyRecordsMock).not.toHaveBeenCalled();
      expect(updateCompanyInCompanyAndOffersMock).toHaveBeenCalledWith({
        ...companyRecord,
        locations: [companyLocationRecord].map(mapCompanyLocationToLocation),
      });
    });
  });

  describe('not all company location batches are saved', () => {
    it('should return false if not all company location batches are saved', async () => {
      getCompanyLocationsByIdMock.mockResolvedValue([companyLocationRecord]);
      isAllCompanyLocationBatchesSavedMock.mockReturnValue(false);

      const result = await handleCompanyLocationsUpdateToCompanies(companyRecord);

      expect(result).toEqual({ companyRecordUpdated: false });
      expect(updateCompanyInCompanyAndOffersMock).not.toHaveBeenCalled();
    });
  });

  describe('no current stored company locations', () => {
    it('should return false if no current stored company locations', async () => {
      getCompanyLocationsByIdMock.mockResolvedValue([]);

      const result = await handleCompanyLocationsUpdateToCompanies(companyRecord);

      expect(result).toEqual({ companyRecordUpdated: false });
      expect(updateCompanyInCompanyAndOffersMock).not.toHaveBeenCalled();
      expect(deleteCompanyRecordsMock).not.toHaveBeenCalled();
    });

    it('should return false if getCompanyLocationsById returns undefined', async () => {
      getCompanyLocationsByIdMock.mockResolvedValue(undefined);
      const companyRecord = companyFactory.build();

      const result = await handleCompanyLocationsUpdateToCompanies(companyRecord);

      expect(result).toEqual({ companyRecordUpdated: false });
    });
  });
});
