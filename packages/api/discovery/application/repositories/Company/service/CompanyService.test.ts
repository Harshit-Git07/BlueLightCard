import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { companyLocationFactory } from '@blc-mono/discovery/application/factories/CompanyLocationFactory';
import { Company } from '@blc-mono/discovery/application/models/Company';
import { mapCompanyToCompanyEntity } from '@blc-mono/discovery/application/repositories/Company/service/mapper/CompanyMapper';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { CompanyRepository } from '../CompanyRepository';

import * as target from './CompanyService';
import { mapCompanyLocationToCompanyLocationEntity } from './mapper/CompanyLocationMapper';

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME) {
      return 'search-offer-company-table';
    }
  }),
  getEnvRaw: jest.fn().mockImplementation((param) => {
    if (param === DiscoveryStackEnvironmentKeys.REGION) {
      return 'eu-west-2';
    }
  }),
}));

const givenCompanyRepositoryBatchDeleteThrowsAnError = () => {
  jest.spyOn(CompanyRepository.prototype, 'batchDelete').mockRejectedValue(new Error('DynamoDB error'));
};

describe('Company Service', () => {
  describe('insertCompany', () => {
    const company = companyFactory.build();

    it('should insert a company successfully', async () => {
      const mockInsert = jest.spyOn(CompanyRepository.prototype, 'insert').mockResolvedValue();

      await target.insertCompany(company);

      expect(mockInsert).toHaveBeenCalledWith(mapCompanyToCompanyEntity(company));
    });

    it('should throw error when company failed to insert', async () => {
      givenCompanyRepositoryInsertThrowsAnError();

      await expect(target.insertCompany(company)).rejects.toThrow(
        `Error occurred inserting new Company with id: [${company.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenCompanyRepositoryInsertThrowsAnError = () => {
      jest.spyOn(CompanyRepository.prototype, 'insert').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('deleteCompanyRecords', () => {
    const company = companyFactory.build();
    const companyLocation = companyLocationFactory.build();
    it('should delete company records successfully', async () => {
      const mockBatchDelete = jest.spyOn(CompanyRepository.prototype, 'batchDelete').mockResolvedValue();

      await target.deleteCompanyRecords([company, companyLocation]);

      expect(mockBatchDelete).toHaveBeenCalledWith([
        mapCompanyToCompanyEntity(company),
        mapCompanyLocationToCompanyLocationEntity(companyLocation),
      ]);
    });

    it('should throw error when failure in the batch delete', async () => {
      givenCompanyRepositoryBatchDeleteThrowsAnError();
      await expect(target.deleteCompanyRecords([company, companyLocation])).rejects.toThrow(
        `Error ocurred batch deleting company records with length: [2]: [Error: DynamoDB error]`,
      );
    });
  });

  describe('insertCompanyLocations', () => {
    const companyLocation = companyLocationFactory.build();

    it('should insert company locations successfully', async () => {
      const mockBatchInsert = jest.spyOn(CompanyRepository.prototype, 'batchInsert').mockResolvedValue();

      await target.insertCompanyLocations([companyLocation]);

      expect(mockBatchInsert).toHaveBeenCalledWith([mapCompanyLocationToCompanyLocationEntity(companyLocation)]);
    });

    it('should throw error when failure in the batch insert', async () => {
      jest.spyOn(CompanyRepository.prototype, 'batchInsert').mockRejectedValue(new Error('DynamoDB error'));

      await expect(target.insertCompanyLocations([companyLocation])).rejects.toThrow(
        `Error occured batch inserting company locations with size: [1]: [Error: DynamoDB error]`,
      );
    });
  });

  describe('getCompanyById', () => {
    const company = companyFactory.build();

    it('should get a company by id successfully', async () => {
      givenCompanyRepositoryGetCompanyByIdReturns(company);

      const result = await target.getCompanyById(company.id);

      expect(result).toEqual(company);
    });

    it('should return "undefined" when no company found', async () => {
      givenCompanyRepositoryGetCompanyByIdReturns(undefined);

      const result = await target.getCompanyById(company.id);

      expect(result).toEqual(undefined);
    });

    it('should throw error when failure in retrieving company by id', async () => {
      givenCompanyRepositoryGetCompanyByIdThrowsAnError();

      await expect(target.getCompanyById(company.id)).rejects.toThrow(
        `Error occurred retrieving Company by id: [${company.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenCompanyRepositoryGetCompanyByIdReturns = (company: Company | undefined) => {
      const companyEntity = company ? mapCompanyToCompanyEntity(company) : undefined;

      jest.spyOn(CompanyRepository.prototype, 'retrieveById').mockResolvedValue(companyEntity);
    };

    const givenCompanyRepositoryGetCompanyByIdThrowsAnError = () => {
      jest.spyOn(CompanyRepository.prototype, 'retrieveById').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getCompanyRecordsById', () => {
    const company = companyFactory.build();
    const companyLocation = companyLocationFactory.build();

    it('should get company records by id successfully', async () => {
      jest
        .spyOn(CompanyRepository.prototype, 'retrieveCompanyRecordsById')
        .mockResolvedValue([
          mapCompanyToCompanyEntity(company),
          mapCompanyLocationToCompanyLocationEntity(companyLocation),
        ]);

      const result = await target.getCompanyRecordsById(company.id);

      expect(result).toEqual([company, companyLocation]);
    });

    it('should return "undefined" when company records are returned as undefined', async () => {
      jest.spyOn(CompanyRepository.prototype, 'retrieveCompanyRecordsById').mockResolvedValue(undefined);

      const result = await target.getCompanyRecordsById(company.id);

      expect(result).toEqual(undefined);
    });

    it('should throw error when failure in retrieving company records by id', async () => {
      jest
        .spyOn(CompanyRepository.prototype, 'retrieveCompanyRecordsById')
        .mockRejectedValue(new Error('DynamoDB error'));

      await expect(target.getCompanyRecordsById(company.id)).rejects.toThrow(
        `Error occurred retrieving Company records by id: [${company.id}]: [Error: DynamoDB error]`,
      );
    });
  });

  describe('getCompanyLocationsById', () => {
    it('should get company locations by id successfully', async () => {
      const companyLocation = companyLocationFactory.build();
      jest
        .spyOn(CompanyRepository.prototype, 'retrieveLocationsByCompanyId')
        .mockResolvedValue([mapCompanyLocationToCompanyLocationEntity(companyLocation)]);

      const result = await target.getCompanyLocationsById(companyLocation.companyId);

      expect(result).toEqual([companyLocation]);
    });

    it('should return "undefined" when company locations are returned as undefined', async () => {
      jest.spyOn(CompanyRepository.prototype, 'retrieveLocationsByCompanyId').mockResolvedValue(undefined);

      const result = await target.getCompanyLocationsById('company-1');

      expect(result).toEqual(undefined);
    });

    it('should throw error when failure in retrieving company locations by id', async () => {
      jest
        .spyOn(CompanyRepository.prototype, 'retrieveLocationsByCompanyId')
        .mockRejectedValue(new Error('DynamoDB error'));

      await expect(target.getCompanyLocationsById('company-1')).rejects.toThrow(
        `Error occurred retrieving company locations by id: [company-1]: [Error: DynamoDB error]`,
      );
    });
  });
});
