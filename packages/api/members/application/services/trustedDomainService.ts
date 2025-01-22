import { ProfileRepository } from '../repositories/profileRepository';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { ZodError } from 'zod';
import { OrganisationRepository } from '../repositories/organisationRepository';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';

interface OrganisationAndEmployerId {
  organisationId: string;
  employerId: string | undefined;
}

export class TrustedDomainService {
  constructor(
    private profileRepository: ProfileRepository = new ProfileRepository(),
    private organisationRepository: OrganisationRepository = new OrganisationRepository(),
  ) {}

  async validateTrustedDomainEmail(memberId: string, trustedDomainEmail: string): Promise<void> {
    const profile = await this.tryGetProfile(memberId);

    const { organisationId, employerId } = profile;
    if (!organisationId) throw new Error('Member profile does not have an organisation');

    const organisationAndEmployerId: OrganisationAndEmployerId = {
      organisationId,
      employerId,
    };

    const trustedDomainFoundOnEmployer = await this.trustedDomainIsOnEmployer(
      organisationAndEmployerId,
      trustedDomainEmail,
    );
    if (trustedDomainFoundOnEmployer) return;

    const trustedDomainFoundOnOrganisation = await this.trustedDomainIsOnOrganisation(
      organisationAndEmployerId,
      trustedDomainEmail,
    );
    if (trustedDomainFoundOnOrganisation) return;

    throw new ValidationError(
      'Trusted domain does not exist for e-mail on employer or organisation trusted domain list',
    );
  }

  private async tryGetProfile(memberId: string): Promise<ProfileModel> {
    try {
      return await this.profileRepository.getProfile(memberId);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(JSON.stringify(error.errors));
      }
      throw error;
    }
  }

  private async trustedDomainIsOnEmployer(
    organisationAndEmployerId: OrganisationAndEmployerId,
    trustedDomainEmail: string,
  ): Promise<boolean> {
    if (!organisationAndEmployerId.employerId) return false;

    const employer = await this.organisationRepository.getEmployer(
      organisationAndEmployerId.organisationId,
      organisationAndEmployerId.employerId,
    );
    return this.checkTrustedDomainEmail(trustedDomainEmail, employer.trustedDomains);
  }

  private async trustedDomainIsOnOrganisation(
    organisationAndEmployerId: OrganisationAndEmployerId,
    trustedDomainEmail: string,
  ) {
    const organisation = await this.organisationRepository.getOrganisation(
      organisationAndEmployerId.organisationId,
    );
    return this.checkTrustedDomainEmail(trustedDomainEmail, organisation.trustedDomains);
  }

  private checkTrustedDomainEmail(email: string, trustedDomains: string[]): boolean {
    const domainOnEmailAddress = email?.split('@')[1].toLowerCase().trim();

    return trustedDomains.some((trustedDomain) => {
      return trustedDomain.toLowerCase().trim() === domainOnEmailAddress;
    });
  }
}
