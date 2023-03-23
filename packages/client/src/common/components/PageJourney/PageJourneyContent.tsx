import { FC, useContext } from 'react';
import PageJourneyContext from './PageJourneyContext';
import { PageJourneyContentProps } from './types';

/**
 * PageJourneyContent component
 * @description Returns a react component based on the current selected block in the journey for a tab
 * @param components
 * @returns {FunctionComponent} React component
 */
const PageJourneyContent: FC<PageJourneyContentProps> = ({ components }) => {
  const { currentContentBlock } = useContext(PageJourneyContext);
  const Component =
    currentContentBlock && components[currentContentBlock] ? components[currentContentBlock] : null;
  return Component ? <Component /> : null;
};

export default PageJourneyContent;
