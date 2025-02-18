import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import {
  createInternalBatchHandler,
  createInternalBatchRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/createInternalBatchHandler';
import {
  isUpdateInternalBatchRoute,
  updateInternalBatchHandler,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/updateInternalBatchHandler';
import {
  getOpenInternalBatchesHandler,
  isGetOpenInternalBatchesHandler,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/getOpenInternalBatchesHandler';
import {
  getAllBatchesHandler,
  isGetAllBatchesRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/getAllBatchesHandler';
import {
  getCardPrintBatchesHandler,
  isGetCardPrintBatchesRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/getCardPrintBatchesHandler';
import {
  getCardPrintBatchHandler,
  isGetCardPrintBatchRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/getCardPrintBatchHandler';
import {
  createCardPrintBatchHandler,
  isCreateCardPrintBatchRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/createCardPrintBatchHandler';
import {
  isUpdateCardPrintBatchRoute,
  updateCardPrintBatchHandler,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/updateCardPrintBatchHandler';
import {
  fixCardPrintBatchHandler,
  isFixCardPrintBatchRoute,
} from '@blc-mono/members/application/handlers/admin/batch/routes/handlers/fixCardPrintBatchHandler';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (createInternalBatchRoute(event)) {
    return await createInternalBatchHandler(event);
  }

  if (isUpdateInternalBatchRoute(event)) {
    return await updateInternalBatchHandler(event);
  }

  if (isGetOpenInternalBatchesHandler(event)) {
    return await getOpenInternalBatchesHandler();
  }

  if (isGetAllBatchesRoute(event)) {
    return await getAllBatchesHandler();
  }

  if (isGetCardPrintBatchesRoute(event)) {
    return await getCardPrintBatchesHandler(event);
  }

  if (isGetCardPrintBatchRoute(event)) {
    return await getCardPrintBatchHandler(event);
  }

  if (isCreateCardPrintBatchRoute(event)) {
    return await createCardPrintBatchHandler(event);
  }

  if (isUpdateCardPrintBatchRoute(event)) {
    return await updateCardPrintBatchHandler(event);
  }

  if (isFixCardPrintBatchRoute(event)) {
    return await fixCardPrintBatchHandler(event);
  }
};

export const handler = middleware(unwrappedHandler);
