import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { MemberProfileRepository } from '../repositories/memberProfileRepository';
import { MemberProfileQueryPayload, MemberProfileUpdatePayload } from '../types/memberProfileTypes';
import { MemberProfileModel } from '../models/memberProfileModel';
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
export class MemberProfileService {
  constructor(
    private profileRepository: MemberProfileRepository,
    private organisationsRepository: OrganisationsRepository,
    private employersRepository: EmployersRepository,
    private logger: Logger,
  ) {}

  /**
   * @swagger
   * /member/profiles:
   *   get:
   *     summary: Retrieve member profiles
   *     tags: [MemberProfileService]
   *     parameters:
   *       - in: query
   *         name: uuid
   *         schema:
   *           type: string
   *         required: true
   *         description: UUID of the member
   *       - in: query
   *         name: profileId
   *         schema:
   *           type: string
   *         required: false
   *         description: If present, the profile number of a single profile to retrieve for a member.  If not present, retrieve all profiles for a member.
   *     responses:
   *       200:
   *         description: A list of member profiles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MemberProfileModel'
   *       404:
   *         description: No profiles found
   *       500:
   *         description: Internal server error
   */
  async getMemberProfiles(
    query: MemberProfileQueryPayload,
    errorList: APIError[],
  ): Promise<MemberProfileModel[] | null> {
    return this.profileRepository.getMemberProfiles(query);
  }

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
  async upsertMemberProfile(
    query: MemberProfileQueryPayload,
    updatedProfile: MemberProfileUpdatePayload,
    isInsert: boolean,
    errorSet: APIError[],
  ): Promise<void> {
    let action: string = isInsert ? 'cre' : 'upd';
    try {
      const parsedModel = MemberProfileModel.parse({
        pk: `MEMBER#${query.memberUUID}`,
        sk: `PROFILE#${query.profileId}`,
        ...updatedProfile,
      });

      if (errorSet.length > 0) return;

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

      if (errorSet.length > 0) return;

      const employers = await this.employersRepository.getEmployers({
        organisationId: parsedModel.organisationId,
        employerId: parsedModel.employerId,
        brand: 'blc-uk',
      });

      if (employers.length === 0) {
        errorSet.push(
          new APIError(APIErrorCode.VALIDATION_ERROR, 'employerId', 'Employer not found'),
        );
        return;
      }

      if (errorSet.length > 0) return;

      await this.profileRepository.upsertMemberProfile(query, updatedProfile, isInsert);
      this.logger.info({
        message: `Profile ${action}ated successfully`,
        body: query,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        (error as ZodError).errors.forEach((issue) => {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, issue.path.join('.'), issue.message),
          );
        });
      } else {
        this.logger.error({
          message: `Unknown error ${action}ating profile:`,
          error: error instanceof Error ? error.message : `Unknown error ${action}ating profile:`,
        });
        throw error;
      }
    }
  }
}
