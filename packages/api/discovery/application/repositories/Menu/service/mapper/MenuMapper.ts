import { Menu, MenuWithOffers, MenuWithSubMenus } from '@blc-mono/discovery/application/models/Menu';
import { MenuResponse, MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import {
  MenuEntity,
  MenuEntityWithOfferEntities,
  MenuEntityWithSubMenuEntities,
  MenuKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

import { mapMenuOfferEntityToMenuOffer, mapMenuOfferToMenuOfferResponse } from './MenuOfferMapper';
import { mapSubMenuEntityToSubMenu } from './SubMenuMapper';

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
    partitionKey: MenuKeyBuilders.buildPartitionKey(menu.id),
    sortKey: MenuKeyBuilders.buildSortKey(menu.id),
    gsi1PartitionKey: MenuKeyBuilders.buildGsi1PartitionKey(menu.menuType),
    gsi1SortKey: MenuKeyBuilders.buildGsi1SortKey(menu.menuType),
    id: menu.id,
    name: menu.name,
    menuType: menu.menuType,
    startTime: menu.startTime,
    endTime: menu.endTime,
    updatedAt: menu.updatedAt,
  };
}

export function mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus(
  menuEntityWithSubMenuEntities: MenuEntityWithSubMenuEntities,
): MenuWithSubMenus {
  const { subMenus, ...menu } = menuEntityWithSubMenuEntities;
  return {
    ...mapMenuEntityToMenu(menu),
    subMenus: subMenus.map(mapSubMenuEntityToSubMenu),
  };
}

export function mapMenuEntityWithOfferEntitiesToMenuWithOffers(
  menuEntityWithOfferEntities: MenuEntityWithOfferEntities,
): MenuWithOffers {
  const { offers, ...menu } = menuEntityWithOfferEntities;
  return {
    ...mapMenuEntityToMenu(menu),
    offers: offers.map(mapMenuOfferEntityToMenuOffer),
  };
}

export function mapMenuAndOfferToSingletonMenuResponse(menuWithOffers: MenuWithOffers[]) {
  if (menuWithOffers.length > 1) {
    throw new Error('Expected exactly one or less menu and offer');
  }
  if (menuWithOffers.length === 0) {
    return undefined;
  }
  return {
    id: menuWithOffers[0].id,
    offers: menuWithOffers[0].offers.map(mapMenuOfferToMenuOfferResponse),
  };
}

export function mapMenuWithSubMenusToFlexibleMenuResponse(menuWithOffers: MenuWithSubMenus[]) {
  return menuWithOffers.map(({ subMenus, ...menu }) => ({
    id: menu.id,
    title: menu.name,
    menus: subMenus.map(({ id, title, imageURL }) => ({ id, title, imageURL })),
  }));
}

export function mapMenuWithOffersToMarketplaceMenuResponses(menuWithOffers: MenuWithOffers[]) {
  return menuWithOffers.map(({ offers, ...menu }) => ({
    id: menu.id,
    title: menu.name,
    offers: offers.map(mapMenuOfferToMenuOfferResponse),
  }));
}

export function mapMenusAndOffersToMenuResponse(
  menusWithOffers: Partial<Record<MenuType, MenuWithOffers[] | MenuWithSubMenus[]>>,
): MenuResponse {
  return {
    dealsOfTheWeek: menusWithOffers.dealsOfTheWeek
      ? mapMenuAndOfferToSingletonMenuResponse(menusWithOffers.dealsOfTheWeek as MenuWithOffers[])
      : undefined,
    featured: menusWithOffers.featured
      ? mapMenuAndOfferToSingletonMenuResponse(menusWithOffers.featured as MenuWithOffers[])
      : undefined,
    marketplace: menusWithOffers.marketplace
      ? mapMenuWithOffersToMarketplaceMenuResponses(menusWithOffers.marketplace as MenuWithOffers[])
      : undefined,
    flexible: menusWithOffers.flexible
      ? mapMenuWithSubMenusToFlexibleMenuResponse(menusWithOffers.flexible as MenuWithSubMenus[])
      : undefined,
  };
}
