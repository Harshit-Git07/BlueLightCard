export enum Events {
  OFFER_CREATED = 'offer.created',
  OFFER_UPDATED = 'offer.updated',
  EVENT_CREATED = 'event.created',
  EVENT_UPDATED = 'event.updated',
  OFFER_DELETED = 'offer.deleted',
  EVENT_DELETED = 'event.deleted',
  SITE_CREATED = 'site.created',
  SITE_UPDATED = 'site.updated',
  SITE_DELETED = 'site.deleted',
  COMPANY_CREATED = 'company.created',
  COMPANY_UPDATED = 'company.updated',
  COMPANY_DELETED = 'company.deleted',
  COMPANY_LOCATION_BATCH_CREATED = 'company.location.batch.created',
  COMPANY_LOCATION_BATCH_UPDATED = 'company.location.batch.updated',
  MARKETPLACE_MENUS_CREATED = 'marketplace.created',
  MARKETPLACE_MENUS_UPDATED = 'marketplace.updated',
  MARKETPLACE_MENUS_DELETED = 'marketplace.deleted',
  MENU_OFFER_CREATED = 'menu.offer.created',
  MENU_OFFER_UPDATED = 'menu.offer.updated',
  MENU_OFFER_DELETED = 'menu.offer.deleted',
  MENU_COMPANY_CREATED = 'menu.company.created',
  MENU_COMPANY_UPDATED = 'menu.company.updated',
  MENU_COMPANY_DELETED = 'menu.company.deleted',
  MENU_CAMPAIGN_CREATED = 'menu.campaign.created',
  MENU_CAMPAIGN_UPDATED = 'menu.campaign.updated',
  MENU_CAMPAIGN_DELETED = 'menu.campaign.deleted',
  MENU_THEMED_OFFER_CREATED = 'menu.themed.offer.created',
  MENU_THEMED_OFFER_UPDATED = 'menu.themed.offer.updated',
  MENU_THEMED_OFFER_DELETED = 'menu.themed.offer.deleted',
  MENU_THEMED_EVENT_CREATED = 'menu.themed.event.created',
  MENU_THEMED_EVENT_UPDATED = 'menu.themed.event.updated',
  MENU_THEMED_EVENT_DELETED = 'menu.themed.event.deleted',
  OPENSEARCH_POPULATE_INDEX = 'opensearch.populate.index',
}

export enum DetailTypes {
  INTEGRATION_TEST = 'test-event',
}
