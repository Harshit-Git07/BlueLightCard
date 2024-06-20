export type CarouselProps = {
  children: React.ReactNode[] | React.ReactNode;

  // Display
  pagination?: boolean;
  navigation?: boolean;

  // Breakpoints
  elementsPerPageDesktop?: number;
  elementsPerPageLaptop?: number;
  elementsPerPageTablet?: number;
  elementsPerPageMobile?: number;
};
