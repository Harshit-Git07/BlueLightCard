import { MemberRedemptionEvent, MemberRedemptionEventSchema } from '@blc-mono/core/schemas/redemptions';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IVaultThresholdService,
  VaultThresholdService,
} from '@blc-mono/redemptions/application/services/vault/VaultThresholdService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class VaultThresholdEmailController extends EventBridgeController<MemberRedemptionEvent> {
  static readonly inject = [Logger.key, VaultThresholdService.key] as const;

  protected parseRequest(request: UnknownEventBridgeEvent): Result<MemberRedemptionEvent, Error> {
    return this.zodParseRequest(request, MemberRedemptionEventSchema);
  }

  constructor(
    logger: ILogger,
    private readonly vaultThresholdService: IVaultThresholdService,
  ) {
    super(logger);
  }

  async handle(request: MemberRedemptionEvent): Promise<void> {
    await this.vaultThresholdService.handleVaultThresholdEmail(request.detail);
  }
}
