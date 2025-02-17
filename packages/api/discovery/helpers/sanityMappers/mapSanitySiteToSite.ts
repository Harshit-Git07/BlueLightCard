import { Site as SanitySite } from '@bluelightcard/sanity-types';

import { Site } from '@blc-mono/discovery/application/models/Site';

export function mapSanitySiteToSite(sanitySite: SanitySite): Site {
  return {
    id: sanitySite._id,
    updatedAt: sanitySite._updatedAt,
    dealsOfTheWeekMenu: {
      id: sanitySite?.dealsOfTheWeekMenu?._id,
    },
    featuredOffersMenu: {
      id: sanitySite?.featuredOffersMenu?._id,
    },
    waysToSaveMenu: {
      id: sanitySite?.waysToSaveMenu?._id,
    },
  };
}
