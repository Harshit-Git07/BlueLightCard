import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import {
  BatchModel,
  CreateInternalBatchModelResponse,
  ExtendedBatchModel,
} from '@blc-mono/shared/models/members/batchModel';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';

const service = new BatchService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isCreateInternalBatchEvent(event)) {
    return await createInternalBatch(event);
  }

  if (isUpdateInternalBatch(event)) {
    return await updateInternalBatch(event);
  }

  if (isOpenInternalBatches(event)) {
    return await openInternalBatches();
  }

  if (isGetBatches(event)) {
    return await getBatches();
  }

  if (isGetCardPrintBatches(event)) {
    return await getCardPrintBatches(event);
  }

  if (isGetCardPrintBatch(event)) {
    return await getCardPrintBatch(event);
  }

  if (isCreateCardPrintBatch(event)) {
    return await createCardPrintBatch(event);
  }

  if (isUpdateCardPrintBatch(event)) {
    return await updateCardPrintBatch(event);
  }

  if (isFixCardPrintBatch(event)) {
    return await fixCardPrintBatch(event);
  }
};

function isCreateInternalBatchEvent(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'POST' && event.path === `/admin/batches/internal`;
}

async function createInternalBatch(
  event: APIGatewayProxyEvent,
): Promise<CreateInternalBatchModelResponse> {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const { name, cardNumbers } = JSON.parse(event.body);
  return await service.createInternalBatch(name, cardNumbers);
}

function isUpdateInternalBatch(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'PUT' && event.path === `/admin/batches/internal`;
}

async function updateInternalBatch(
  event: APIGatewayProxyEvent,
): Promise<CreateInternalBatchModelResponse> {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const { batchId, cardNumbers } = JSON.parse(event.body);
  return await service.updateInternalBatch(batchId, cardNumbers);
}

function isOpenInternalBatches(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/batches/internal`;
}

async function openInternalBatches(): Promise<BatchModel[]> {
  return await service.openInternalBatches();
}

function isGetBatches(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/batches/all`;
}

async function getBatches(): Promise<ExtendedBatchModel[]> {
  return await service.getBatches();
}

function isGetCardPrintBatches(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/cards/batches`;
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCardPrintBatches(event: APIGatewayProxyEvent): Promise<CardPrintBatchModel[]> {
  // TODO: Actually implement this
  return [
    {
      cardNumbers: ['ABC123456'],
    },
  ];
}

function isGetCardPrintBatch(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'GET' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCardPrintBatch(event: APIGatewayProxyEvent): Promise<CardPrintBatchModel> {
  // TODO: Actually implement this
  return {
    cardNumbers: ['ABC13456'],
  };
}

function isCreateCardPrintBatch(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'POST' && event.path === `/admin/cards/batches`;
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createCardPrintBatch(event: APIGatewayProxyEvent): Promise<void> {
  // TODO: Implement handler
}

function isUpdateCardPrintBatch(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'PUT' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}`
  );
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateCardPrintBatch(event: APIGatewayProxyEvent): Promise<void> {
  // TODO: Implement handler
}

function isFixCardPrintBatch(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'POST' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}/fix`
  );
}

async function fixCardPrintBatch(event: APIGatewayProxyEvent): Promise<void> {
  const { batchId } = event.pathParameters || {};
  if (!batchId) {
    throw new ValidationError('Batch ID is required');
  }

  return await service.fixBatch(batchId);
}

export const handler = middleware(unwrappedHandler);
