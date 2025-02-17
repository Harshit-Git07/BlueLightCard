import {
  CreateOrganisationModel,
  OrganisationModel,
  UpdateOrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import {
  CreateEmployerModel,
  EmployerModel,
  UpdateEmployerModel,
} from '@blc-mono/shared/models/members/employerModel';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { OrganisationRepository } from '@blc-mono/members/application/repositories/organisationRepository';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';
import {
  getOrganisationIdMappings,
  mapOrganisationsAndEmployers,
} from '@blc-mono/members/application/services/organisation/id-mapping/organisationIdMapping';

export class OrganisationService {
  constructor(private organisationRepository = new OrganisationRepository()) {}

  async getIdRequirementDocs(): Promise<GetIdRequirementDocsModel[]> {
    try {
      logger.debug({ message: 'Fetching ID requirement docs' });
      return await this.organisationRepository.getIdRequirementDocs();
    } catch (error) {
      logger.error({ message: 'Error fetching ID requirement docs', error });
      throw error;
    }
  }

  async createOrganisation(organisation: CreateOrganisationModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating organisation' });
      return await this.organisationRepository.createOrganisation(organisation);
    } catch (error) {
      logger.error({ message: 'Error creating organisation', error });
      throw error;
    }
  }

  async createOrganisations(organisations: OrganisationModel[]): Promise<string[]> {
    try {
      logger.debug({ message: 'Creating organisations' });
      return await this.organisationRepository.createOrganisations(organisations);
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
      await this.organisationRepository.updateOrganisation(organisationId, organisation);
    } catch (error) {
      logger.error({ message: 'Error updating organisation', error });
      throw error;
    }
  }

  async getOrganisations(): Promise<OrganisationModel[]> {
    try {
      logger.debug({ message: 'Fetching organisations' });
      return await this.organisationRepository.getOrganisations();
    } catch (error) {
      logger.error({ message: 'Error fetching organisations', error });
      throw error;
    }
  }

  async getOrganisation(organisationId: string): Promise<OrganisationModel> {
    try {
      logger.debug({ message: 'Fetching organisation', organisationId });
      return await this.organisationRepository.getOrganisation(organisationId);
    } catch (error) {
      logger.error({ message: 'Error fetching organisation', organisationId, error });
      throw error;
    }
  }

  async createEmployer(organisationId: string, employer: CreateEmployerModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating employer' });
      return await this.organisationRepository.createEmployer(organisationId, employer);
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
      return await this.organisationRepository.createEmployers(organisationId, employers);
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
      await this.organisationRepository.updateEmployer(organisationId, employerId, employer);
    } catch (error) {
      logger.error({ message: 'Error updating employer', error });
      throw error;
    }
  }

  async getEmployers(organisationId: string): Promise<EmployerModel[]> {
    try {
      logger.debug({ message: 'Fetching employers', organisationId });
      return await this.organisationRepository.getEmployers(organisationId);
    } catch (error) {
      logger.error({ message: 'Error fetching employers', organisationId, error });
      throw error;
    }
  }

  async getEmployer(organisationId: string, employerId: string): Promise<EmployerModel> {
    try {
      logger.debug({ message: 'Fetching employer', organisationId, employerId });
      return await this.organisationRepository.getEmployer(organisationId, employerId);
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
