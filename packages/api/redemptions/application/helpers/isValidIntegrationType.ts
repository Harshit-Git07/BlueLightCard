import { integrationEnum } from '@blc-mono/redemptions/libs/database/schema';

export const isValidIntegrationType = (integration: string | null | undefined): boolean => {
  if (!integration) {
    return false;
  }
  if (Object.values(integrationEnum.enumValues).includes(integration)) {
    return true;
  }

  return false;
};
