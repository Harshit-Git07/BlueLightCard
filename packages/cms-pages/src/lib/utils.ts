import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Props as NavLinks } from '@bluelightcard/shared-ui/components/NavBar/components/NavLink';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nl2br(str?: string) {
  if (!str) return '';
  return str.split('\n').join('<br>');
}

export function slug(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s\W]+/g, '-')
    .replace(/-$/, '');
}

export function getRevalidationValue() {
  const revalidateTime = Number(process.env.NEXT_PUBLIC_REVALIDATE);
  return !isNaN(revalidateTime) ? revalidateTime : false;
}

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
