import { z } from 'zod';

import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  EventBridgeController,
  UnknownEventBridgeEvent,
} from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import {
  IPromotionUpdateService,
  PromotionUpdateResults,
  PromotionUpdateService,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

export const PromotionUpdatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.PROMOTION_UPDATED,
  z.string(),
  z.object({
    id: z.number(),
    name: z.string(),
    start: z.string(),
    end: z.string(),
    status: z.number(),
    link: z.string().url(),
    platform: PLATFORM_SCHEMA,
    bannerName: z.string(),
    promotionType: z.number(),
    companyId: z.number(),
    isAgeGated: z.boolean(),
  }),
);
export type PromotionUpdatedEvent = z.infer<typeof PromotionUpdatedEventSchema>;

export class PromotionUpdateController extends EventBridgeController<PromotionUpdatedEvent> {
  static readonly inject = [Logger.key, PromotionUpdateService.key] as const;

  constructor(protected readonly logger: ILogger, private readonly promotionsUpdateService: IPromotionUpdateService) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<PromotionUpdatedEvent, Error> {
    return this.zodParseRequest(request, PromotionUpdatedEventSchema);
  }

  public async handle(request: PromotionUpdatedEvent): Promise<void> {
    const result = await this.promotionsUpdateService.handlePromotionUpdate(request);
    switch (result.kind) {
      case PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS:
        this.logger.info({
          message: 'Promotion updated successfully',
        });
        return;
      case PromotionUpdateResults.NO_PROMOTIONS_UPDATED:
        throw new Error('No promotions updated');
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
