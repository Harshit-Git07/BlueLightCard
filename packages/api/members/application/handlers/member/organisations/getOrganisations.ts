import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import 'dd-trace/init';
import { middleware } from '../../../middleware';
import { Context } from 'aws-lambda';
import { OrganisationModel } from '@blc-mono/members/application/models/organisationModel';

const orgService = new OrganisationService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<OrganisationModel[]> => {
  return await orgService.getOrganisations();
};

export const handler = middleware(unwrappedHandler);
