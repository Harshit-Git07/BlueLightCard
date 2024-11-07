import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { CompaniesResponse, CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'companies-get' });

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  logger.info({ message: `Getting all companies` });
  const { organisation, dob } = getQueryParams(event);

  return Response.OK({ message: 'Success', data: getCompanies(dob, organisation) });
};

const getCompanies = (dob?: string, organisation?: string): CompaniesResponse => {
  logger.debug({ message: `Getting all companies for dob=${dob} organisation=${organisation}` });
  return {
    data: [
      buildDummyCompany(1),
      buildDummyCompany(2),
      buildDummyCompany(3),
      buildDummyCompany(4),
      buildDummyCompany(5),
    ],
  };
};

export const buildDummyCompany = (id: number): CompanySummary => {
  return {
    companyID: '24069b9c8eb7591046d066ef57e26a94',
    legacyCompanyID: 9694,
    companyName: `Stonehouse Pizza & Carvery ${id}`,
  };
};

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const organisation = queryParams?.organisation;
  const dob = queryParams?.dob;

  return { organisation, dob };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
