import { MappingProperty } from '@opensearch-project/opensearch/api/types';

import { OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';

type OpenSearchFieldMapping = Record<keyof OpenSearchBody, MappingProperty>;

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
  company_id: { type: 'keyword' },
  legacy_company_id: { type: 'long' },
  company_name: {
    type: 'text',
    fields: {
      raw: {
        type: 'keyword',
      },
    },
  },
  company_locations: {
    type: 'nested',
    properties: {
      location_id: { type: 'text' },
      geo_point: { type: 'geo_point' },
      store_name: { type: 'text' },
    },
  },
  company_name_stripped: { type: 'text' },
  company_small_logo: { type: 'text' },
  company_tags: { type: 'text' },
  age_restrictions: { type: 'text' },
  included_trusts: { type: 'text' },
  excluded_trusts: { type: 'text' },
  category_name: { type: 'text' },
  category_id: { type: 'text' },
  date_offer_last_updated: { type: 'date' },
  venue_id: { type: 'text' },
  venue_name: { type: 'text' },
};
