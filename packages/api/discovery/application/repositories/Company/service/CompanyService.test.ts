import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { Company } from '@blc-mono/discovery/application/models/Company';
import { mapCompanyToCompanyEntity } from '@blc-mono/discovery/application/repositories/Company/service/mapper/CompanyMapper';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { CompanyRepository } from '../CompanyRepository';

import * as target from './CompanyService';

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
});
