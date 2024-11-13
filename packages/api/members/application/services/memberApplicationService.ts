import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { MemberApplicationRepository } from '../repositories/memberApplicationRepository';
import {
  MemberApplicationQueryPayload,
  MemberApplicationUpdatePayload,
} from '../types/memberApplicationTypes';
import { MemberApplicationModel } from '../models/memberApplicationModel';
import { APIError } from '../models/APIError';
import { APIErrorCode } from '../enums/APIErrorCode';
import { ZodError } from 'zod';

/**
 * @swagger
 * tags:
 *   name: MemberApplicationService
 *   description: Service for managing member applications
 */
export class MemberApplicationService {
  constructor(
    private repository: MemberApplicationRepository,
    private logger: Logger,
  ) {}

  /**
   * @swagger
   * /member/applications:
   *   get:
   *     summary: Retrieve member applications
   *     tags: [MemberApplicationService]
   *     parameters:
   *       - in: query
   *         name: uuid
   *         schema:
   *           type: string
   *         required: true
   *         description: UUID of the member
   *       - in: query
   *         name: applicationId
   *         schema:
   *           type: string
   *         required: false
   *         description: If present, the application number of a single application to retrieve for a member.  If not present, retrieve all applications for a member.
   *     responses:
   *       200:
   *         description: A list of member applications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MemberApplicationModel'
   *       404:
   *         description: No applications found
   *       500:
   *         description: Internal server error
   */
  async getMemberApplications(
    query: MemberApplicationQueryPayload,
    errorList: APIError[],
  ): Promise<MemberApplicationModel[] | null> {
    return this.repository.getMemberApplications(query);
  }

  /**
   * @swagger
   * /member/applications:
   *   put:
   *     summary: Update a member application
   *     tags: [MemberApplicationService]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MemberApplicationUpdatePayload'
   *     responses:
   *       200:
   *         description: Application updated successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async upsertMemberApplication(
    query: MemberApplicationQueryPayload,
    updatedApplication: MemberApplicationUpdatePayload,
    isInsert: boolean,
    errorSet: APIError[],
  ): Promise<void> {
    let action: string = isInsert ? 'cre' : 'upd';
    try {
      const parsedModel = MemberApplicationModel.parse({
        pk: `MEMBER#${query.memberUUID}`,
        sk: `APPLICATION#${query.applicationId}`,
        ...updatedApplication,
      });

      if (isInsert) {
        if (parsedModel.eligibilityStatus == undefined) {
          this.logger.info({ message: 'eligibilityStatus is required on create' });
          errorSet.push(
            new APIError(
              APIErrorCode.VALIDATION_ERROR,
              'eligibilityStatus',
              'eligibilityStatus is required on create',
            ),
          );
        }
        if (parsedModel.verificationMethod == undefined) {
          this.logger.info({ message: 'verificationMethod is required on create' });
          errorSet.push(
            new APIError(
              APIErrorCode.VALIDATION_ERROR,
              'verificationMethod',
              'verificationMethod is required on create',
            ),
          );
        }
      }

      if (errorSet.length > 0) return;

      this.logger.info({
        message: `Attempting to ${action}ate application to ${this.repository.tableName}`,
        body: query,
      });
      await this.repository.upsertMemberApplication(query, updatedApplication, isInsert);
      this.logger.info({ message: `Application ${action}ated successfully`, body: query });
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((issue) => {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, issue.path.join('.'), issue.message),
          );
        });
      } else {
        this.logger.error({
          message: `Unknown error ${action}ating application:`,
          error:
            error instanceof Error ? error.message : `Unknown error ${action}ating application`,
        });
        throw error;
      }
    }
  }
}
