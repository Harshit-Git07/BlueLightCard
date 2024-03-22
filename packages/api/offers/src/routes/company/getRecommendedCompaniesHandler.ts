import { APIGatewayEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { HttpStatusCode } from '@blc-mono/core/src/types/http-status-code.enum';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';
import { getEnv } from '../../../../core/src/utils/getEnv';
import companyList from './companies.json'
import { RecommendedCompaniesService } from "../../services/recommendedCompaniesService";

const ALL_COMPANIES: CompanyResults = companyList as CompanyResults;
const UNAUTHORIZED_MESSAGE = 'Authorization token not set';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Authorization'
};

const service: string = getEnv('service');
const logger = new Logger({ serviceName: `${service}-get-details` });
const tableName = getEnv('tableName');

const recommendedCompaniesService = new RecommendedCompaniesService(tableName, logger);

interface CompanyResult {
  id: number;
  name: string;
}

type CompanyResults = CompanyResult[];

interface RecommendedCompany {
  id: number;
  imageSrc: string;
  brandName: string;
}

export const handler = async (event: APIGatewayEvent) => {
  try {
    const authToken = event.headers.Authorization as string;
    if (!authToken) {
      logger.error({ message: UNAUTHORIZED_MESSAGE });
      return Response.Unauthorized({ message: UNAUTHORIZED_MESSAGE }, CORS_HEADERS);
    }

    return getRecommendedCompaniesResponse(getLegacyUserId(authToken));
  } catch (error: any) {
    logger.error({ message: 'Error fetching recommended company details', data: error });
    return error;
  }
};

const getRecommendedCompaniesResponse = async (uid: string): Promise<Response> => {
  try {
    const recommendedCompanies = await recommendedCompaniesService.getById(uid);

    if (recommendedCompanies) {
      const filteredCompanies = ALL_COMPANIES.filter((company) =>
        recommendedCompanies.company_id.includes(company.id.toString()),
      );

      const companiesResponse = buildCompaniesResponse(filteredCompanies, recommendedCompanies);
      return Response.OK({ message: 'Success', data: companiesResponse }, CORS_HEADERS);
    }
  } catch (error) {
    logger.error({ message: `Error fetching recommended companies for user ${uid}`, data: error });
    return Response.Error(error as Error, HttpStatusCode.INTERNAL_SERVER_ERROR, CORS_HEADERS);
  }

  return Response.OK({ message: 'Success', data: [] }, CORS_HEADERS);
}

const buildCompaniesResponse = (companies: CompanyResults, recommendedCompanies: Record<string, any>): RecommendedCompany[] => {
  return recommendedCompanies.company_id
    .map((id: string) => {
      const company = companies?.find((company) => company.id === Number(id));
      if (company) {
        return {
          id: company.id,
          imageSrc: `https://cdn.bluelightcard.co.uk/companyimages/complarge/retina/${company.id}.jpg`,
          brandName: company.name,
        };
      }
      return undefined;
    })
    .filter((recommendedCompany: RecommendedCompany | undefined) => recommendedCompany !== undefined);
}

