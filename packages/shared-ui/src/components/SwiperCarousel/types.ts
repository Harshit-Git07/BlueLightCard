import { PropsWithChildren } from 'react';

export type CarouselProps = {
  // Display
  pagination?: boolean;
  navigation?: boolean;

  // Breakpoints
  elementsPerPageDesktop?: number;
  elementsPerPageLaptop?: number;
  elementsPerPageTablet?: number;
  elementsPerPageMobile?: number;
} & PropsWithChildren;
