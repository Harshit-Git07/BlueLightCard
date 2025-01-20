import { logger } from '../middleware';
import BrazeClient from '../braze/brazeClient';
import { MarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';
import { BrazeUpdateModel } from '@blc-mono/members/application/models/brazeUpdateModel';

export default class MarketingService {
  constructor(private readonly brazeClient: BrazeClient = new BrazeClient()) {}

  async getAttributes(memberId: string, attributes: string[]): Promise<Record<string, unknown>> {
    try {
      logger.debug({ message: 'Fetching Braze attributes', memberId, attributes });
      return await this.brazeClient.getAttributes(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error fetching Braze attributes', error });
      throw error;
    }
  }

  async getPreferences(
    memberId: string,
    environment: MarketingPreferencesEnvironment,
  ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    try {
      logger.debug({ message: 'Fetching marketing preferences', memberId, environment });
      return await this.brazeClient.getMarketingPreferences(memberId, environment);
    } catch (error) {
      logger.error({ message: 'Error fetching marketing preferences', error });
      throw error;
    }
  }

  async updateBraze(memberId: string, attributes: BrazeUpdateModel['attributes']): Promise<void> {
    try {
      logger.debug({ message: 'Updating marketing preferences', memberId });
      await this.brazeClient.updateBraze(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error updating marketing preferences', error });
      throw error;
    }
  }
}
