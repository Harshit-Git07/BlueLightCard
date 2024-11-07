import {
  DeleteParameterCommand,
  GetParameterCommand,
  ParameterNotFound,
  PutParameterCommand,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { isAfter } from 'date-fns';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { Site } from '@blc-mono/discovery/application/models/Site';
import { buildErrorMessage } from '@blc-mono/discovery/application/repositories/Company/service/utils/ErrorMessageBuilder';
import { updateSingletonMenuId } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const logger = new LambdaLogger({ serviceName: 'site-event-handler' });

const client = new SSMClient();

const buildParameterName = (): string => {
  const stage = getEnv(DiscoveryStackEnvironmentKeys.STAGE);
  return `/${stage}/discovery/siteConfig`;
};

export async function getSiteConfig(): Promise<Site | undefined> {
  const parameterName = buildParameterName();
  const command = new GetParameterCommand({ Name: parameterName });
  try {
    const response = await client.send(command);
    if (!response?.Parameter?.Value) {
      return;
    }
    return JSON.parse(response.Parameter?.Value) as Site;
  } catch (error) {
    if (error instanceof ParameterNotFound) {
      logger.info({
        message: `No site config found for parameter name: ${parameterName}`,
      });
      return;
    }
    logger.error({
      message: `Error fetching site config for parameter name: ${parameterName}`,
      body: error,
    });
    throw new Error(
      buildErrorMessage(logger, error, `Error fetching site config for parameter name: ${parameterName}`),
    );
  }
}

export async function insertSiteConfig(newSiteRecord: Site): Promise<void> {
  const parameterName = buildParameterName();
  const command = new PutParameterCommand({
    Name: parameterName,
    Value: JSON.stringify(newSiteRecord),
    Overwrite: true,
    Type: 'String',
  });
  try {
    await client.send(command);
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error updating site config for parameter name: ${parameterName}`),
    );
  }
}

export async function deleteSiteConfig(): Promise<void> {
  const parameterName = buildParameterName();
  const command = new DeleteParameterCommand({
    Name: parameterName,
  });
  try {
    await client.send(command);
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error deleting site config for parameter name: ${parameterName}`),
    );
  }
}

export async function handleSiteUpdated(newSiteRecord: Site): Promise<void> {
  const currentSiteRecord = await getSiteConfig();
  if (!currentSiteRecord || isAfter(new Date(newSiteRecord.updatedAt), new Date(currentSiteRecord.updatedAt))) {
    await insertSiteConfig(newSiteRecord);
    const menusChanged = haveMenuIdsChanged(newSiteRecord, currentSiteRecord);
    if (menusChanged.dealsOfTheWeek && newSiteRecord.dealsOfTheWeekMenu.id) {
      await updateSingletonMenuId(newSiteRecord.dealsOfTheWeekMenu?.id, MenuType.DEALS_OF_THE_WEEK);
    }
    if (menusChanged.featured && newSiteRecord.featuredOffersMenu.id) {
      await updateSingletonMenuId(newSiteRecord.featuredOffersMenu?.id, MenuType.FEATURED);
    }
    logger.info({
      message: `Site record with id: [${newSiteRecord.id}] has been successfully updated.`,
    });
  } else {
    logger.info({
      message: `Site record with id: [${newSiteRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleSiteDeleted(siteRecord: Site): Promise<void> {
  const currentSiteRecord = await getSiteConfig();
  if (!currentSiteRecord) return;

  if (isAfter(new Date(siteRecord.updatedAt), new Date(currentSiteRecord.updatedAt))) {
    await deleteSiteConfig();
    logger.info({
      message: `Site record with id: [${siteRecord.id}] has been successfully deleted.`,
    });
  } else {
    logger.info({
      message: `Site record with id: [${siteRecord.id}] is not newer than current stored record, so will not be deleted.`,
    });
  }
}

function haveMenuIdsChanged(newSite: Site, oldSite?: Site): { dealsOfTheWeek: boolean; featured: boolean } {
  if (!oldSite) return { dealsOfTheWeek: true, featured: true };
  return {
    dealsOfTheWeek: oldSite.dealsOfTheWeekMenu?.id !== newSite.dealsOfTheWeekMenu?.id,
    featured: oldSite.featuredOffersMenu?.id !== newSite.featuredOffersMenu?.id,
  };
}
