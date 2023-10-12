export type CarouselProps = {
  children: React.ReactNode[] | React.ReactNode;

  // Display
  hideArrows?: boolean;
  hidePillButtons?: boolean;
  loop?: boolean;

  // Breakpoints
  elementsPerPageDesktop?: number;
  elementsPerPageLaptop?: number;
  elementsPerPageTablet?: number;
  elementsPerPageMobile?: number;

  // Auto play
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
};
