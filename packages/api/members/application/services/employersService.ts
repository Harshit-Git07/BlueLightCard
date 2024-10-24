import { LambdaLogger } from '@blc-mono/core/src/utils/logger/lambdaLogger';
import { EmployersRepository } from 'application/repositories/employersRepository';
import { EmployersQueryPayload } from 'application/types/employerTypes';
import { EmployerModel } from '../models/employerModel';
import { OrganisationsRepository } from '../repositories/organisationsRepository';
import { APIError } from '../models/APIError';
import { APIErrorCode } from '../enums/APIErrorCode';

export class EmployersService {
  constructor(
    private readonly employerRepository: EmployersRepository,
    private readonly organisationsRepository: OrganisationsRepository,
    private readonly logger: LambdaLogger,
  ) {}

  async getEmployers({
    brand,
    organisationId,
    employerId,
  }: EmployersQueryPayload): Promise<{ employerList: EmployerModel[]; errorSet: APIError[] }> {
    const errorSet: APIError[] = [];
    let employerList: EmployerModel[] = [];
    try {
      // This check for the organisation should be removed when we move to the new table
      // but because we dont know which table we are reading and it may change
      // depending on the brand, we need to keep this check in for the mean time.
      const organisation = await this.organisationsRepository.getOrganisations({
        brand,
        organisationId,
      });

      if (organisation.length === 0) {
        this.logger.info({
          message: `No organisation found for brand: ${brand} with ID: ${organisationId}. 
          Returning empty array`,
        });
        errorSet.push(
          new APIError(
            APIErrorCode.RESOURCE_NOT_FOUND,
            'getEmployers',
            `No organisation found for brand: ${brand} with ID: ${organisationId}.`,
          ),
        );
      } else {
        employerList = await this.employerRepository.getEmployers({
          brand,
          organisationId,
          employerId,
        });
      }
    } catch (error) {
      this.logger.error({
        message: `Error fetching Employers for organisation: ${organisationId}`,
        body: { error },
      });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'getEmployers',
          `Error fetching employers for brand: ${brand} with ID: ${organisationId}.`,
        ),
      );
    }
    return { employerList, errorSet };
  }
}
