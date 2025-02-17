import { Props as NavLinks } from '@bluelightcard/shared-ui/components/NavBar/components/NavLink';

export type SanityLink = Sanity.Link & {
  links?: Sanity.LinkList['links'];
};

export type SanityMenuLinks = (Sanity.Link | Sanity.LinkList)[] | undefined;

function handleMissingSlashPrefix(url: string | undefined) {
  return !url?.startsWith('/') ? `/${url}` : url;
}

export function mapToNavLinks(menuItems: SanityMenuLinks): NavLinks[] {
  return (
    menuItems?.map((item, idx) => {
      const link = item as SanityLink;
      return {
        id: `${item.label}_${idx}`,
        label: item.label,
        url:
          link.type === 'external'
            ? link.external
            : handleMissingSlashPrefix(link.internal?.metadata.slug.current),
        links: mapToNavLinks(link.links ?? []),
      } as NavLinks;
    }) ?? []
  );
}
