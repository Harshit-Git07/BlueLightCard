import { FC, useContext } from 'react';
import PageJourneyContext from './PageJourneyContext';
import { PageJourneyContentProps } from './types';

/**
 * PageJourneyContent component
 * @description Returns a react component based on the current tab step in the journey for a tab
 * @param components
 * @returns {FunctionComponent} React component
 */
const PageJourneyContent: FC<PageJourneyContentProps> = ({ components }) => {
  const { currentTabStep } = useContext(PageJourneyContext);
  const Component =
    currentTabStep && components[currentTabStep] ? components[currentTabStep] : null;
  return Component ? <Component /> : null;
};

export default PageJourneyContent;
