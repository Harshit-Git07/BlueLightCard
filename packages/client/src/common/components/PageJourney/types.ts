import { PropsWithChildren } from 'react';

interface PageJourneyTab {
  id: string;
  label: string;
  currentTab?: boolean;
  progress?: number;
}

export type PageJourneyProps = PropsWithChildren & {
  tabs: PageJourneyTab[];
};
