import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  EventBridgeController,
  UnknownEventBridgeEvent,
} from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import {
  PromotionUpdateResults,
  PromotionUpdateService,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

const promotionUpdatedDetailSchema = eventSchema(
  RedemptionsDatasyncEvents.PROMOTION_UPDATED,
  z.string(),
  z.object({
    id: z.number(),
    name: z.string(),
    start: z.string(),
    end: z.string(),
    status: z.number(),
    link: z.string().url(),
    platform: z.string(),
    bannerName: z.string(),
    promotionType: z.number(),
    companyId: z.number(),
    isAgeGated: z.boolean(),
  }),
);

export type PromotionUpdatedEvent = z.infer<typeof promotionUpdatedDetailSchema>;
export class PromotionUpdateController extends EventBridgeController<PromotionUpdatedEvent> {
  static readonly inject = [Logger.key, PromotionUpdateService.key] as const;

  constructor(protected readonly logger: ILogger, private readonly promotionsUpdateService: PromotionUpdateService) {
    super();
  }
  public async handle(request: PromotionUpdatedEvent): Promise<void> {
    const eventResponse = await this.promotionsUpdateService.handlePromotionUpdate(request);
    const { payload, kind } = eventResponse;
    switch (kind) {
      case PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS:
        this.logger.info(payload);
        break;
      case PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL:
        this.logger.error(payload);
        break;
      default:
        exhaustiveCheck(kind, 'Unhandled result kind');
    }
  }
  protected parseRequest(request: UnknownEventBridgeEvent): Result<PromotionUpdatedEvent, Error> {
    return this.zodParseRequest(request, promotionUpdatedDetailSchema);
  }
}
