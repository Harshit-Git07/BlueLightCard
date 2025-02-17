import { MenuThemedOffer as SanityThemedMenu } from '@bluelightcard/sanity-types';

import { getSiteConfig } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { ThemedMenuOffer } from '@blc-mono/discovery/application/models/ThemedMenu';

async function determineThemedMenuType(
  themedMenu: SanityThemedMenu,
): Promise<MenuType.WAYS_TO_SAVE | MenuType.FLEXIBLE_OFFERS> {
  const siteConfig = await getSiteConfig();
  if (siteConfig?.waysToSaveMenu?.id === themedMenu._id) {
    return MenuType.WAYS_TO_SAVE;
  }
  return MenuType.FLEXIBLE_OFFERS;
}

export async function mapSanityThemedMenuToThemedMenu(themedMenu: SanityThemedMenu): Promise<ThemedMenuOffer> {
  if (!themedMenu.title) {
    throw new Error('Missing sanity field: title');
  }

  const menuType = await determineThemedMenuType(themedMenu);

  return {
    id: themedMenu._id,
    updatedAt: themedMenu._updatedAt,
    endTime: themedMenu.end,
    startTime: themedMenu.start,
    menuType,
    name: themedMenu.title,
    themedMenusOffers:
      themedMenu.inclusions?.map((collection, index) => {
        if (!collection.collectionName) {
          throw new Error('Missing sanity field: collectionName');
        }
        if (!collection.collectionDescription) {
          throw new Error('Missing sanity field: collectionDescription');
        }
        return {
          id: collection._key,
          title: collection.collectionName,
          description: collection.collectionDescription,
          imageURL: collection.offerCollectionImage?.default?.asset?.url ?? '',
          position: index,
          offers:
            collection.contents
              ?.filter((content) => content._type === 'offerReference')
              .map((offer, i) => {
                if (!offer.reference) {
                  throw new Error('Missing sanity field: reference');
                }
                if (!offer.reference.company) {
                  throw new Error('Missing sanity field: company');
                }
                return {
                  id: offer.reference._id,
                  company: {
                    id: offer.reference?.company?._id ?? '',
                  },
                  position: i,
                  overrides: {
                    title: offer?.overrides?.title,
                    image: offer?.overrides?.image?.default?.asset?.url,
                    description: offer?.overrides?.description,
                  },
                };
              }) ?? [],
        };
      }) ?? [],
  };
}
