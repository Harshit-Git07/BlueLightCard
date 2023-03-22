import { FC } from 'react';
import { ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';
import { PageJourneyProps } from './types';
import { desktopSmall } from '@/utils/breakpoints';

const StyledPJContainer = styled.div``;

const StyledPJContainerChildren = styled.div`
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

const PageJourney: FC<PageJourneyProps> = ({ tabs, children }) => {
  return (
    <StyledPJContainer>
      <StyledPJTabContainer>
        {tabs.map((tab, index) => (
          <StyledPJTab key={tab.id}>
            <StyledPJTabHeader>
              <span>{index + 1}.</span>
              <span className="font-weight--semi-bold">{tab.label}</span>
            </StyledPJTabHeader>
            <StyledPJTabProgressBar now={tab.progress ?? 0} />
          </StyledPJTab>
        ))}
      </StyledPJTabContainer>
      <StyledPJContainerChildren>{children}</StyledPJContainerChildren>
    </StyledPJContainer>
  );
};

export default PageJourney;
