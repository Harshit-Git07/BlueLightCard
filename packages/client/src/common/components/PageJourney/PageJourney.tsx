import { FC, useMemo } from 'react';
import { ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';
import { PageJourneyProgress, PageJourneyProps } from './types';
import { desktopSmall } from '@/utils/breakpoints';
import PageJourneyContext from './PageJourneyContext';
import PageJourneyContent from './PageJourneyContent';

const StyledPJContainer = styled.div``;

const StyledPJContainerProvider = styled(PageJourneyContext.Provider)`
  padding: 1rem;
`;

const StyledPJTabContainer = styled.ul`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  @media only screen and (min-width: ${desktopSmall}) {
    gap: 1.4rem;
  }
`;

const StyledPJTab = styled.li`
  width: 100%;
`;

const StyledPJTabHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
`;

const StyledPJTabProgressBar = styled(ProgressBar)`
  height: 0.6rem;
`;

/**
 * PageJourney component
 * @description Page journey component for handling the journey through (n) number of tabs
 * @param props
 * @returns {FunctionComponent} React component
 */
const PageJourney: FC<PageJourneyProps> = ({ tabs, children }) => {
  /**
   * Calculates the progress of each tab of the journey
   *
   * @returns {object} Key value map of tab Id to tab progress
   */
  const calculateProgress = useMemo<PageJourneyProgress>(() => {
    return tabs.reduce<PageJourneyProgress>((acc, tab) => {
      // locate the marker=true in the blocks to determine the current progress of this tab
      if (!tab.complete) {
        const currentContentBlockIndex = tab.contentBlocks.findIndex((block) => !!block.marker);
        if (currentContentBlockIndex > -1) {
          acc[tab.id] = ((currentContentBlockIndex + 1) / tab.contentBlocks.length) * 100;
        }
      } else {
        acc[tab.id] = 100;
      }
      return acc;
    }, {});
  }, [tabs]);

  /**
   * Finds the current content block selected and returns the component key for it
   * @returns {string} Component key
   */
  const currentContentBlock = useMemo(() => {
    return tabs.reduce((acc, tab) => {
      const currentContentBlock = tab.contentBlocks.find((block) => !!block.current);
      if (currentContentBlock) {
        acc = currentContentBlock.componentKey;
      }
      return acc;
    }, '');
  }, [tabs]);

  return (
    <StyledPJContainer>
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
      <StyledPJContainerProvider value={{ currentContentBlock }}>
        {children}
      </StyledPJContainerProvider>
    </StyledPJContainer>
  );
};

export default Object.assign(PageJourney, {
  PageJourneyContent,
});
