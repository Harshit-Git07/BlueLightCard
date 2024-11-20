import { OrganisationRepository } from '../repositories/organisationRepository';
import { OrganisationModel } from '../models/organisationModel';
import { logger } from '../middleware';
import { EmployerModel } from '../models/employerModel';

export class OrganisationService {
  constructor(private repository: OrganisationRepository = new OrganisationRepository()) {}

  async getOrganisations(): Promise<OrganisationModel[]> {
    try {
      logger.debug({ message: 'Fetching organisations' });
      return await this.repository.getOrganisations();
    } catch (error) {
      logger.error({ message: 'Error fetching organisations', error });
      throw error;
    }
  }

  async getOrganisation(organisationId: string): Promise<OrganisationModel> {
    try {
      logger.debug({ message: 'Fetching organisation', organisationId });
      return await this.repository.getOrganisation(organisationId);
    } catch (error) {
      logger.error({ message: 'Error fetching organisation', organisationId, error });
      throw error;
    }
  }

  async getEmployers(organisationId: string): Promise<EmployerModel[]> {
    try {
      logger.debug({ message: 'Fetching employers', organisationId });
      return await this.repository.getEmployers(organisationId);
    } catch (error) {
      logger.error({ message: 'Error fetching employers', organisationId, error });
      throw error;
    }
  }

  async getEmployer(organisationId: string, employerId: string): Promise<EmployerModel> {
    try {
      logger.debug({ message: 'Fetching employer', organisationId, employerId });
      return await this.repository.getEmployer(organisationId, employerId);
    } catch (error) {
      logger.error({ message: 'Error fetching employer', employerId, error });
      throw error;
    }
  }
}
