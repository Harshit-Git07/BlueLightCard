import { PropsWithChildren } from 'react';

// types.ts
export type BreadcrumbLink = PropsWithChildren & {
  name: string;
  href: string;
};

export type BreadcrumbsProps = PropsWithChildren & {
  trail: BreadcrumbLink[];
};
