import { Menu, MenuWithOffers } from '@blc-mono/discovery/application/models/Menu';
import { MenuResponse, MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import {
  MenuEntity,
  MenuEntityWithOfferEntities,
  MenuKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

import { mapMenuOfferEntityToOffer, mapOfferToMenuOfferResponse } from './MenuOfferMapper';

export function mapMenuEntityToMenu(menuEntity: MenuEntity): Menu {
  return {
    id: menuEntity.id,
    name: menuEntity.name,
    startTime: menuEntity.startTime,
    endTime: menuEntity.endTime,
    updatedAt: menuEntity.updatedAt,
    menuType: menuEntity.menuType,
  };
}

export function mapMenuToMenuEntity(menu: Menu): MenuEntity {
  return {
    ...menu,
    partitionKey: MenuKeyBuilders.buildPartitionKey(menu.id),
    sortKey: MenuKeyBuilders.buildSortKey(menu.id),
    gsi1PartitionKey: MenuKeyBuilders.buildGsi1PartitionKey(menu.menuType),
    gsi1SortKey: MenuKeyBuilders.buildGsi1SortKey(menu.menuType),
  };
}

export function mapMenuEntityWithOfferEntitiesToMenuWithOffers(
  menuEntityWithOfferEntities: MenuEntityWithOfferEntities,
): MenuWithOffers {
  const { offers, ...menu } = menuEntityWithOfferEntities;
  return {
    ...mapMenuEntityToMenu(menu),
    offers: offers.map(mapMenuOfferEntityToOffer),
  };
}

export function mapMenuAndOfferToSingletonMenuResponse(menuWithOffers: MenuWithOffers[]) {
  if (menuWithOffers.length > 1) {
    throw new Error('Expected exactly one or less menu and offer');
  }
  if (menuWithOffers.length === 0) {
    return { offers: [] };
  }
  return {
    offers: menuWithOffers[0].offers.map(mapOfferToMenuOfferResponse),
  };
}

export function mapMenuWithOffersToFlexibleMenuResponse(menuWithOffers: MenuWithOffers[]) {
  return menuWithOffers.map((menuWithOffer) => ({
    id: menuWithOffer.id,
    title: menuWithOffer.name,
    imageURL: '',
  }));
}

export function mapMenuWithOffersToMarketplaceMenuResponses(menuWithOffers: MenuWithOffers[]) {
  return menuWithOffers.map(({ offers, ...menu }) => ({
    title: menu.name,
    offers: offers.map(mapOfferToMenuOfferResponse),
  }));
}

export function mapMenusAndOffersToMenuResponse(
  menusWithOffers: Partial<Record<MenuType, MenuWithOffers[]>>,
): MenuResponse {
  return {
    dealsOfTheWeek: menusWithOffers.dealsOfTheWeek
      ? mapMenuAndOfferToSingletonMenuResponse(menusWithOffers.dealsOfTheWeek)
      : undefined,
    featured: menusWithOffers.featured ? mapMenuAndOfferToSingletonMenuResponse(menusWithOffers.featured) : undefined,
    marketplace: menusWithOffers.marketplace
      ? mapMenuWithOffersToMarketplaceMenuResponses(menusWithOffers.marketplace)
      : undefined,
    flexible: menusWithOffers.flexible ? mapMenuWithOffersToFlexibleMenuResponse(menusWithOffers.flexible) : undefined,
  };
}
