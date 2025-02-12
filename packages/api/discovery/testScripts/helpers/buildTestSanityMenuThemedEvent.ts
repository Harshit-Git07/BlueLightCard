import { Event as SanityEvent, MenuThemedEvent as SanityMenuThemedEvent } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export function buildTestSanityMenuThemedEvent(
  events: SanityEvent[],
  id?: string,
  subMenuId?: string,
): SanityMenuThemedEvent {
  return {
    _createdAt: '2024-07-30T09:36:14Z',
    _id: id ?? v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'menu.themed.event',
    _updatedAt: new Date().toISOString(),
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    inclusions: [
      {
        _type: 'themed.event',
        _key: subMenuId ?? `collection-${v4()}`,
        eventCollectionDescription: [
          {
            _key: 'block1',
            children: [
              {
                _key: 'span1',
                text: 'This is a heading',
                marks: [] as string[],
                _type: 'span' as const,
              },
            ],
            style: 'h1' as const,
            listItem: 'number' as const,
            markDefs: [] as never[],
            level: 1,
            _type: 'block' as const,
          },
          {
            _key: 'block2',
            children: [
              {
                _key: 'span2',
                text: 'This is a paragraph.',
                marks: [] as string[],
                _type: 'span' as const,
              },
            ],
            style: 'normal' as const,
            markDefs: [
              {
                _key: 'link1',
                _type: 'link' as const,
                href: 'https://example.com',
              },
            ],
            level: 1,
            _type: 'block' as const,
          },
        ],
        eventCollectionName: 'Test Collection Name',
        eventCollectionImage: {
          default: {
            _type: 'image',
            asset: {
              url: 'url',
              _id: id ?? v4(),
              _updatedAt: new Date().toISOString(),
              _type: 'sanity.imageAsset',
              _createdAt: '2024-07-30T09:36:14Z',
              _rev: 'HxAzVxEm31DFQTCb4WY0L5',
            },
          },
        },
        events: events.map((event) => ({ event, _key: event._id, _type: 'eventReference' })),
      },
    ],
    title: 'Test Menu Themed Event',
  };
}
