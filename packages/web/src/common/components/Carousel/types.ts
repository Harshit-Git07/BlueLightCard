export type CarouselProps = {
  children: React.ReactNode[] | React.ReactNode;

  // Display
  hidePillButtons?: boolean;
  loop?: boolean;
  focusCenter?: boolean;

  // Breakpoints
  elementsPerPageDesktop?: number;
  elementsPerPageLaptop?: number;
  elementsPerPageTablet?: number;
  elementsPerPageMobile?: number;

  // Control
  clickToScroll?: boolean;
  showControls?: boolean;
  swipeToScroll?: boolean;

  // Auto play
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;

  // Custom styles
  className?: string;
  focusedClassName?: string;
};
