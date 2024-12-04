import { OrganisationRepository } from '../repositories/organisationRepository';
import {
  CreateOrganisationModel,
  OrganisationModel,
  UpdateOrganisationModel,
} from '../models/organisationModel';
import { logger } from '../middleware';
import { CreateEmployerModel, EmployerModel, UpdateEmployerModel } from '../models/employerModel';
import { IdRequirementModel } from '../models/idRequirementsModel';

export class OrganisationService {
  constructor(private repository: OrganisationRepository = new OrganisationRepository()) {}

  async getIdRequirementDocs(): Promise<IdRequirementModel[]> {
    try {
      logger.debug({ message: 'Fetching ID requirement docs' });
      return await this.repository.getIdRequirementDocs();
    } catch (error) {
      logger.error({ message: 'Error fetching ID requirement docs', error });
      throw error;
    }
  }

  async createOrganisation(organisation: CreateOrganisationModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating organisation' });
      return await this.repository.createOrganisation(organisation);
    } catch (error) {
      logger.error({ message: 'Error creating organisation', error });
      throw error;
    }
  }

  async updateOrganisation(
    organisationId: string,
    organisation: UpdateOrganisationModel,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Updating organisation' });
      await this.repository.updateOrganisation(organisationId, organisation);
    } catch (error) {
      logger.error({ message: 'Error updating organisation', error });
      throw error;
    }
  }

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

  async createEmployer(organisationId: string, employer: CreateEmployerModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating employer' });
      return await this.repository.createEmployer(organisationId, employer);
    } catch (error) {
      logger.error({ message: 'Error creating employer', error });
      throw error;
    }
  }

  async updateEmployer(
    organisationId: string,
    employerId: string,
    employer: UpdateEmployerModel,
  ): Promise<void> {
    try {
      logger.debug({ message: 'Updating employer' });
      await this.repository.updateEmployer(organisationId, employerId, employer);
    } catch (error) {
      logger.error({ message: 'Error updating employer', error });
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
