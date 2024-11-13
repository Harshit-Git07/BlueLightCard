import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { OrganisationsRepository } from 'application/repositories/organisationsRepository';
import { OrganisationsQueryPayload } from 'application/types/organisationTypes';
import { OrganisationModel } from '../models/organisationModel';
import { APIError } from '../models/APIError';
import { APIErrorCode } from '../enums/APIErrorCode';

export class OrganisationService {
  constructor(
    private repository: OrganisationsRepository,
    private logger: Logger,
  ) {}

  async getOrganisations({ brand, organisationId }: OrganisationsQueryPayload): Promise<{
    organisationList: OrganisationModel[];
    errorSet: APIError[];
  }> {
    let organisationList: OrganisationModel[] = [];
    const errorSet: APIError[] = [];
    try {
      organisationList = await this.repository.getOrganisations({ brand, organisationId });
    } catch (error) {
      this.logger.error({ message: 'Error fetching organisations', body: { error } });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'getOrganisations',
          'Error fetching organisations',
        ),
      );
    }
    return { organisationList, errorSet };
  }
}
