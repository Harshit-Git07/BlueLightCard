import { FC, useMemo } from 'react';
import { ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';
import { PageJourneyCurrentTabStep, PageJourneyProgress, PageJourneyProps } from './types';
import { desktopSmall, tablet } from '@/utils/breakpoints';
import PageJourneyContext from './PageJourneyContext';
import PageJourneyContent from './PageJourneyContent';

const StyledPJContainer = styled.div``;

const StyledPJContainerProvider = styled(PageJourneyContext.Provider)`
  padding: 1rem;
`;

const StyledPJTabContainer = styled.ul`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1rem;
  @media only screen and (min-width: ${tablet}) {
    gap: 1rem;
  }
  @media only screen and (min-width: ${desktopSmall}) {
    gap: 1.4rem;
  }
`;

const StyledPJTab = styled.li`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledPJTabHeader = styled.div`
  display: none;
  @media only screen and (min-width: ${tablet}) {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
  }
`;

const StyledPJTabProgressBar = styled(ProgressBar)`
  height: 0.4rem;
  @media only screen and (min-width: ${tablet}) {
    height: 0.6rem;
  }
`;

const StyledPJMobileHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.3rem;
  padding: 0.5rem 0;
  @media only screen and (min-width: ${tablet}) {
    display: none;
  }
`;

const StyledPJMobileHeaderSlot = styled.div`
  margin-right: 0.7rem;
  padding-left: 0.7rem;
`;

/**
 * PageJourney component
 * @description Page journey component for handling the journey through (n) number of tabs
 * @param props
 * @returns {FunctionComponent} React component
 */
const PageJourney: FC<PageJourneyProps> = ({
  tabs,
  mobileHeaderStartSlot,
  mobileHeaderEndSlot,
  children,
}) => {
  const totalTabsSize = tabs.length;
  /**
   * Calculates the progress of each tab of the journey
   *
   * @returns {object} Key value map of tab Id to tab progress
   */
  const calculateProgress = useMemo<PageJourneyProgress>(() => {
    return tabs.reduce<PageJourneyProgress>((acc, tab) => {
      // locate the marker=true in the steps to determine the current progress of this tab
      if (!tab.complete) {
        const currentTabStepIndex = tab.steps.findIndex((step) => !!step.marker);
        if (currentTabStepIndex > -1) {
          acc[tab.id] = ((currentTabStepIndex + 1) / tab.steps.length) * 100;
        }
      } else {
        acc[tab.id] = 100;
      }
      return acc;
    }, {});
  }, [tabs]);

  /**
   * Finds the current tab step selected and returns the component key and tab label for it
   * @returns {string} Component key
   */
  const currentTabStep = useMemo<PageJourneyCurrentTabStep>(() => {
    return tabs.reduce<PageJourneyCurrentTabStep>((acc, tab, tabIndex) => {
      const currentTabStep = tab.steps.find((step) => !!step.current);
      if (currentTabStep) {
        acc.tabIndex = tabIndex + 1;
        acc.tabLabel = tab.label;
        acc.componentKey = currentTabStep.componentKey;
      }
      return acc;
    }, {});
  }, [tabs]);

  return (
    <StyledPJContainer>
      <StyledPJMobileHeader>
        {mobileHeaderStartSlot && (
          <StyledPJMobileHeaderSlot>{mobileHeaderStartSlot}</StyledPJMobileHeaderSlot>
        )}
        <span>
          {currentTabStep.tabIndex} of {totalTabsSize}
        </span>
        <span className="font-weight--semi-bold">{currentTabStep.tabLabel}</span>
        {mobileHeaderEndSlot && (
          <StyledPJMobileHeaderSlot>{mobileHeaderEndSlot}</StyledPJMobileHeaderSlot>
        )}
      </StyledPJMobileHeader>
      <StyledPJTabContainer>
        {tabs.map((tab, index) => (
          <StyledPJTab key={tab.id}>
            <StyledPJTabHeader>
              <span>{index + 1}.</span>
              <span className="font-weight--semi-bold">{tab.label}</span>
            </StyledPJTabHeader>
            <StyledPJTabProgressBar now={calculateProgress[tab.id] ?? 0} />
          </StyledPJTab>
        ))}
      </StyledPJTabContainer>
      <StyledPJContainerProvider value={{ currentTabStep: currentTabStep.componentKey }}>
        {children}
      </StyledPJContainerProvider>
    </StyledPJContainer>
  );
};

export default Object.assign(PageJourney, {
  PageJourneyContent,
});
