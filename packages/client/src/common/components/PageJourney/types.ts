import { ComponentType, PropsWithChildren, ReactElement } from 'react';

interface PageJourneyTabStep {
  id: string;
  componentKey: string;
  marker?: boolean;
  current?: boolean;
}

interface PageJourneyTab {
  id: string;
  label: string;
  complete?: boolean;
  steps: PageJourneyTabStep[];
}

export interface PageJourneyProgress {
  [id: string]: number;
}

export interface PageJourneyCurrentTabStep {
  tabLabel?: string;
  tabIndex?: number;
  componentKey?: string;
}

export interface PageJourneyContextData {
  currentTabStep?: string; // componentKey
}

export type PageJourneyProps = PropsWithChildren & {
  tabs: PageJourneyTab[];
  mobileHeaderStartSlot?: ReactElement;
  mobileHeaderEndSlot?: ReactElement;
};

export interface PageJourneyContentProps {
  components: {
    [componentKey: string]: ComponentType;
  };
}

export interface StyledPJTabHeaderProps {
  current?: boolean;
}
