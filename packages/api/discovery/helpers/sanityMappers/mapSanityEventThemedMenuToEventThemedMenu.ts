import { MenuThemedEvent as SanityThemedMenu } from '@bluelightcard/sanity-types';

import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { ThemedMenuEvent } from '@blc-mono/discovery/application/models/ThemedMenu';

export function mapSanityEventThemedMenuToEventThemedMenu(themedMenu: SanityThemedMenu): ThemedMenuEvent {
  if (!themedMenu.title) {
    throw new Error('Missing sanity field: title');
  }

  return {
    id: themedMenu._id,
    updatedAt: themedMenu._updatedAt,
    endTime: themedMenu.end,
    startTime: themedMenu.start,
    menuType: MenuType.FLEXIBLE,
    name: themedMenu.title,
    themedMenusEvents:
      themedMenu.inclusions?.map((themedEventCollection) => {
        if (!themedEventCollection.eventCollectionName) {
          throw new Error('Missing sanity field: eventCollectionName');
        }
        if (!themedEventCollection.eventCollectionDescription) {
          throw new Error('Missing sanity field: eventCollectionDescription');
        }
        return {
          id: themedEventCollection._key,
          title: themedEventCollection.eventCollectionName,
          description: getBlockText(themedEventCollection.eventCollectionDescription),
          imageURL: themedEventCollection.eventCollectionImage?.default?.asset?.url ?? '',
          events:
            themedEventCollection.events?.map((event) => {
              return {
                id: event._id,
                venue: {
                  id: event.venue?._id ?? '',
                },
              };
            }) ?? [],
        };
      }) ?? [],
  };
}

export function getBlockText(
  block?: (
    | {
        children?: {
          text?: string;
          _type?: string;
        }[];
        style?: string;
        _type?: string;
      }
    | { _type: 'image'; _key: string }
    | { _type: 'codeBlock'; _key: string }
  )[],
  lineBreakChar = '↵ ',
) {
  return (
    block?.reduce((accumulatedText, blockItem, index) => {
      if (blockItem._type === 'block' && blockItem.children) {
        const text = blockItem.children.map((child) => child.text ?? '').join('');
        return accumulatedText + text + (index !== block.length - 1 ? lineBreakChar : '');
      }
      return accumulatedText;
    }, '') ?? ''
  );
}
