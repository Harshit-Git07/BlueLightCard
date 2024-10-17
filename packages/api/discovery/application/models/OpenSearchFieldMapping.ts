import { OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';

type OpenSearchFieldMapping = Record<keyof OpenSearchBody, { type: string; analyzer?: string }>;

export const openSearchFieldMapping: OpenSearchFieldMapping = {
  offer_id: { type: 'text' },
  legacy_offer_id: { type: 'long' },
  offer_name: {
    type: 'text',
    analyzer: 'snowball',
  },
  offer_status: { type: 'text' },
  offer_type: { type: 'text' },
  offer_description: {
    type: 'text',
    analyzer: 'snowball',
  },
  offer_description_stripped: {
    type: 'text',
    analyzer: 'snowball',
  },
  offer_image: { type: 'text' },
  offer_expires: { type: 'date' },
  offer_start: { type: 'date' },
  offer_tags: { type: 'text' },
  company_id: { type: 'text' },
  company_name: { type: 'text' },
  company_name_stripped: { type: 'text' },
  company_small_logo: { type: 'text' },
  company_tags: { type: 'text' },
  age_restrictions: { type: 'text' },
  included_trusts: { type: 'text' },
  excluded_trusts: { type: 'text' },
  category_name: { type: 'text' },
  new_category_1: { type: 'text' },
  category_level_2: { type: 'text' },
  category_level_3: { type: 'text' },
  category_level_4: { type: 'text' },
  date_offer_last_updated: { type: 'date' },
};
