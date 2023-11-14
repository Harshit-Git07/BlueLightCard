import { Logger } from '@aws-lambda-powertools/logger';
import { Company } from '../models/company';
import { filterUndefinedValues } from '../utils/filters';
import { CompanyRepository } from '../repositories/companyRepository';
import { UpdateCompanyDetails } from '../eventBridge/lambdas/company/companyEventDetail';

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.companyRepository = new CompanyRepository(tableName);
  }

  public async getByLegacyId(legacyId: string) {
    try {
      const result = await this.companyRepository.getByLegacyId(legacyId);
      if (result && result.Items && result.Count && result.Count > 0) {
        return result.Items[0] as Company;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('Get company legacyId failed', { error });
      throw error;
    }
  }

  public async updateIsApprovedByLegacyId(legacyId: string, isApproved: boolean) {
    const company: Company | undefined = await this.getByLegacyId(legacyId);
    if (!company) {
      this.logger.error('Company Update IsApproved, Company not found for legacyID ', { legacyId: legacyId });
      throw new Error(`Company Update IsApproved, Company not found ${legacyId}`);
    } else {
      try {
        await this.companyRepository.updateIdApprovedField(company.id!, isApproved);
      } catch (error) {
        this.logger.error(' Company Update for IsApproved failed', { error });
        throw error;
      }
    }
  }

  public async updateSmallLogoByLegacyId(legacyId: string, smallLogo: string) {
    const company: Company | undefined = await this.getByLegacyId(legacyId);
    if (!company) {
      this.logger.error('Company Update Small Logo, Company not found for legacyID ', { legacyId: legacyId });
      throw new Error(`Company Update Small Logo, Company not found ${legacyId}`);
    } else {
      try {
        await this.companyRepository.updateCompanySmallLogo(company.id!, smallLogo);
      } catch (error) {
        this.logger.error(' Company Update for Small Logo failed', { error });
        throw error;
      }
    }
  }

  public async updateLargeLogoByLegacyId(legacyId: string, largeLogo: string) {
    const company: Company | undefined = await this.getByLegacyId(legacyId);
    if (!company) {
      this.logger.error('Company Update Large Logo, Company not found for legacyID ', { legacyId: legacyId });
      throw new Error(`Company Update Large Logo, Company not found ${legacyId}`);
    } else {
      try {
        await this.companyRepository.updateCompanyLargeLogo(company.id!, largeLogo);
      } catch (error) {
        this.logger.error(' Company Update for Large Logo failed', { error });
        throw error;
      }
    }
  }

  public async updateBothLogosByLegacyId(legacyId: string, largeLogo: string, smallLogo: string) {
    const company: Company | undefined = await this.getByLegacyId(legacyId);
    if (!company) {
      this.logger.error('Company Update Both Logos, Company not found for legacyID ', { legacyId: legacyId });
      throw new Error(`Company Update Both Logos, Company not found ${legacyId}`);
    } else {
      try {
        await this.companyRepository.updateCompanyBothLogos(company.id!, largeLogo, smallLogo);
      } catch (error) {
        this.logger.error(' Company Update for Both Logos failed', { error });
        throw error;
      }
    }
  }

  /**
   * In this method we are merging the updated company details to the existing company details.
   * Get the existing company details from the database and merge the updated company details to the existing company details.
   *
   * @param {string} legacyId - The legacy ID of the company.
   * @param {Company} companyDetails - The new company details to merge.
   * @throws {Error} If the company is not found.
   * @returns {Company} The merged company details.
   */
  public async mergeUpdatedToExistsCompanyDetails(legacyId: string, companyDetails: Company | UpdateCompanyDetails) {
    const company: Company | undefined = await this.getByLegacyId(legacyId);
    if (!company) {
      this.logger.error('Company Update, Company not found ', { legacyId: legacyId });
      throw new Error(`Company Update, Company not found ${legacyId}`);
    } else {
      return { ...company, ...filterUndefinedValues(companyDetails), legacyId: company.legacyId };
    }
  }
}
