import { Site as SanitySite } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export function buildTestSanitySite(dealsOfTheWeekId?: string, featuredId?: string): SanitySite {
  return {
    _id: v4(),
    _type: 'site',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: v4(),
    dealsOfTheWeekMenu: {
      _id: dealsOfTheWeekId ?? v4(),
      _rev: v4(),
      _type: 'menu.offer',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
    },
    featuredOffersMenu: {
      _id: featuredId ?? v4(),
      _rev: v4(),
      _type: 'menu.offer',
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
    },
  };
}
