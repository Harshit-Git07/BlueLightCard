import { MenuThemedOffer as SanityThemedMenu, MenuWaysToSave } from '@bluelightcard/sanity-types';

import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { ThemedMenuOffer } from '@blc-mono/discovery/application/models/ThemedMenu';
import { MenuEventTypes } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { mapSanityMenuEventTypeToMenuType } from './mapSanityMenuEventTypeToMenuType';

export function mapSanityThemedMenuToThemedMenu(themedMenu: SanityThemedMenu | MenuWaysToSave): ThemedMenuOffer {
  if (!themedMenu.title) {
    throw new Error('Missing sanity field: title');
  }

  const menuType = mapSanityMenuEventTypeToMenuType(themedMenu._type as MenuEventTypes);

  if (menuType !== MenuType.FLEXIBLE_OFFERS && menuType !== MenuType.WAYS_TO_SAVE) {
    throw new Error('Invalid menu type');
  }

  return {
    id: themedMenu._id,
    updatedAt: themedMenu._updatedAt,
    endTime: themedMenu.end,
    startTime: themedMenu.start,
    menuType: menuType,
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
