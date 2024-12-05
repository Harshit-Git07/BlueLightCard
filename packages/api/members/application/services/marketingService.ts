import { logger } from '../middleware';
import BrazeClient from '../braze/brazeClient';

export default class MarketingService {
  constructor(private readonly brazeClient: BrazeClient = new BrazeClient()) {}

  async getAttributes(memberId: string, attributes: string[]): Promise<Record<string, string>> {
    try {
      logger.debug({ message: 'Fetching Braze attributes', memberId, attributes });
      return await this.brazeClient.getAttributes(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error fetching Braze attributes', error });
      throw error;
    }
  }

  async getPreferences(memberId: string, environment: 'web' | 'mobile') {
    try {
      logger.debug({ message: 'Fetching marketing preferences', memberId, environment });
      return await this.brazeClient.getMarketingPreferences(memberId, environment);
    } catch (error) {
      logger.error({ message: 'Error fetching marketing preferences', error });
      throw error;
    }
  }

  async updateBraze(memberId: string, attributes: object) {
    try {
      logger.debug({ message: 'Updating marketing preferences', memberId });
      await this.brazeClient.updateBraze(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error updating marketing preferences', error });
      throw error;
    }
  }
}
