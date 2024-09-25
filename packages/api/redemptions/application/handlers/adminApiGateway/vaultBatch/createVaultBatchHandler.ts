import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CreateVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { CreateVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/CreateVaultBatchService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { S3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';

import { S3SignedUrl } from '../../../helpers/S3SignedUrl';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-create-vaultBatch` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  .provideClass(RedemptionConfigRepository.key, RedemptionConfigRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  .provideClass(S3ClientProvider.key, S3ClientProvider)
  .provideClass(S3SignedUrl.key, S3SignedUrl)
  .provideClass(CreateVaultBatchService.key, CreateVaultBatchService)
  .injectClass(CreateVaultBatchController);

export const handler = controller.invoke;
