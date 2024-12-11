import { datadog } from 'datadog-lambda-js';
import { BatchService } from '@blc-mono/members/application/services/batchService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const batchService = new BatchService();

const unwrappedHandler = async (): Promise<void> => {
  await batchService.generateExternalBatchesFile();
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(unwrappedHandler) : unwrappedHandler;
