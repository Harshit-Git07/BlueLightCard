import { Logger } from '@aws-lambda-powertools/logger';
import { OrganisationsRepository } from 'application/repositories/organisationsRepository';
import { OrganisationsQueryPayload } from 'application/types/organisationTypes';
import { OrganisationModel } from '../models/organisationModel';

export class OrganisationService {
  constructor(private repository: OrganisationsRepository, private logger: Logger) {}

  async getOrganisations({
    brand,
    organisationId,
  }: OrganisationsQueryPayload): Promise<OrganisationModel[]> {
    try {
      return await this.repository.getOrganisations({ brand, organisationId });
    } catch (error) {
      this.logger.error('Error fetching organisations', {
        error,
        brand,
      });
      throw new Error('Error fetching organisations');
    }
  }
}
