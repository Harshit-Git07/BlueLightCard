import { PropsWithChildren } from 'react';

interface PageJourneyContentBlock {
  id: string;
  componentKey: string;
  marker?: boolean;
  current?: boolean;
}

interface PageJourneyTab {
  id: string;
  label: string;
  complete?: boolean;
  contentBlocks: PageJourneyContentBlock[];
}

export interface PageJourneyProgress {
  [id: string]: number;
}

export interface PageJourneyContextData {
  currentContentBlock?: string; // componentKey
}

export type PageJourneyProps = PropsWithChildren & {
  tabs: PageJourneyTab[];
};

export interface PageJourneyContentProps {
  components: {
    [componentKey: string]: any;
  };
}
