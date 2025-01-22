import { OrganisationRepository } from '../repositories/organisationRepository';
import {
  CreateOrganisationModel,
  OrganisationModel,
  UpdateOrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { logger } from '../middleware';
import {
  CreateEmployerModel,
  EmployerModel,
  UpdateEmployerModel,
} from '@blc-mono/shared/models/members/employerModel';
import { IdRequirementModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import {
  getOrganisationIdMappings,
  mapOrganisationsAndEmployers,
} from '@blc-mono/members/application/utils/organisationIdMapping';

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

  async createOrganisations(organisations: OrganisationModel[]): Promise<string[]> {
    try {
      logger.debug({ message: 'Creating organisations' });
      return await this.repository.createOrganisations(organisations);
    } catch (error) {
      logger.error({ message: 'Error creating organisations', error });
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

  async createEmployers(
    organisationId: string,
    employers: CreateEmployerModel[],
  ): Promise<string[]> {
    try {
      logger.debug({ message: 'Creating employers' });
      return await this.repository.createEmployers(organisationId, employers);
    } catch (error) {
      logger.error({ message: 'Error creating employers', error });
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

  async loadOrganisationsAndEmployers(): Promise<void> {
    logger.info({ message: 'Loading Organisations and Employers' });
    const organisationIdMappings = await getOrganisationIdMappings();
    const { organisations, employers } = mapOrganisationsAndEmployers(organisationIdMappings);

    await this.createOrganisations(organisations);
    for (const organisationId of employers.keys()) {
      await this.createEmployers(organisationId, employers.get(organisationId) ?? []);
    }
    logger.info({
      message: `Loaded ${organisations.length} Organisations`,
    });
  }
}
