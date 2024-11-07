import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfileCustomerRepository } from '../repositories/memberProfileCustomerRepository';
import {
  MemberProfileCustomerQueryPayload,
  MemberProfileCustomerUpdatePayload,
} from '../types/memberProfileCustomerTypes';
import { MemberProfileCustomerModel } from '../models/memberProfileCustomerModel';
import { APIError } from '../models/APIError';
import { APIErrorCode } from '../enums/APIErrorCode';
import { ZodError } from 'zod';
import { OrganisationsRepository } from '../repositories/organisationsRepository';
import { EmployersRepository } from '../repositories/employersRepository';

/**
 * @swagger
 * tags:
 *   name: MemberProfileService
 *   description: Service for managing member profiles
 */
export class MemberProfileCustomerService {
  constructor(
    private profileRepository: MemberProfileCustomerRepository,
    private organisationsRepository: OrganisationsRepository,
    private employersRepository: EmployersRepository,
    private logger: Logger,
  ) {}

  /**
   * @swagger
   * /member/profiles:
   *   put:
   *     summary: Update a member profile
   *     tags: [MemberProfileService]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MemberProfileUpdatePayload'
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async upsertMemberProfileCustomer(
    query: MemberProfileCustomerQueryPayload,
    updatedProfile: MemberProfileCustomerUpdatePayload,
    isInsert: boolean,
    errorSet: APIError[],
  ): Promise<void> {
    let action: string = isInsert ? 'cre' : 'upd';
    try {
      const parsedModel = MemberProfileCustomerModel.parse({
        pk: `MEMBER#${query.memberUUID}`,
        sk: `PROFILE#${query.profileId}`,
        ...updatedProfile,
      });

      if (errorSet.length > 0) return;

      if (parsedModel.organisationId != undefined) {
        const organisations = await this.organisationsRepository.getOrganisations({
          organisationId: parsedModel.organisationId,
          brand: 'blc-uk',
        });

        if (organisations.length === 0) {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, 'organisationId', 'Organisation not found'),
          );
          return;
        }
      }

      if (errorSet.length > 0) return;

      if (parsedModel.employerId != undefined) {
        const employers = await this.employersRepository.getEmployers({
          organisationId: parsedModel.organisationId!,
          employerId: parsedModel.employerId!,
          brand: 'blc-uk',
        });

        if (employers.length === 0) {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, 'employerId', 'Employer not found'),
          );
          return;
        }
      }

      if (errorSet.length > 0) return;

      await this.profileRepository.upsertMemberProfileCustomer(query, updatedProfile, isInsert);
      this.logger.info(`Profile ${action}ated successfully`, { query });
    } catch (error) {
      if (error instanceof ZodError) {
        (error as ZodError).errors.forEach((issue) => {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, issue.path.join('.'), issue.message),
          );
        });
      } else {
        this.logger.error(`Unknown error ${action}ating profile:`, { error });
        throw error;
      }
    }
  }
}
