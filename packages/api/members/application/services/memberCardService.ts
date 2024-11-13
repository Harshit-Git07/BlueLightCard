import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { MemberCardRepository } from '../repositories/memberCardRepository';
import { MemberCardQueryPayload, MemberCardUpdatePayload } from '../types/memberCardTypes';
import { MemberCardModel } from '../models/memberCardModel';

/**
 * @swagger
 * tags:
 *   name: MemberCardService
 *   description: Service for managing member cards
 */
export class MemberCardService {
  constructor(
    private repository: MemberCardRepository,
    private logger: Logger,
  ) {}

  /**
   * @swagger
   * /member/cards:
   *   get:
   *     summary: Retrieve member cards
   *     tags: [MemberCardService]
   *     parameters:
   *       - in: query
   *         name: uuid
   *         schema:
   *           type: string
   *         required: true
   *         description: UUID of the member
   *       - in: query
   *         name: cardNumber
   *         schema:
   *           type: string
   *         required: false
   *         description: If present, the card number of a single card to retrieve for a member.  If not present, retrieve all cards for a member.
   *     responses:
   *       200:
   *         description: A list of member cards
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MemberCardModel'
   *       404:
   *         description: No cards found
   *       500:
   *         description: Internal server error
   */
  async getMemberCards(query: MemberCardQueryPayload): Promise<MemberCardModel[] | null> {
    try {
      return await this.repository.getMemberCards(query);
    } catch (error) {
      this.logger.error({
        message: 'Error updating card:',
        error: error instanceof Error ? error.message : 'Unknown error updating card',
      });
      throw error;
    }
  }

  /**
   * @swagger
   * /member/cards:
   *   put:
   *     summary: Update a member card
   *     tags: [MemberCardService]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MemberCardUpdatePayload'
   *     responses:
   *       200:
   *         description: Card updated successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async updateMemberCard(
    query: MemberCardQueryPayload,
    updatedCard: MemberCardUpdatePayload,
  ): Promise<void> {
    try {
      MemberCardModel.parse({
        pk: `MEMBER#${query.uuid}`,
        sk: `CARD#${query.cardNumber}`,
        ...updatedCard,
      });
      await this.repository.updateMemberCard(query, updatedCard, false);
      this.logger.info({ message: 'Card updated successfully', body: query });
    } catch (error) {
      this.logger.error({
        message: 'Error updating card',
        error: error instanceof Error ? error.message : 'Unknown error updating card',
      });
      throw error;
    }
  }
}
