import { FC, useMemo } from 'react';
import { PageJourneyCurrentTabStep, PageJourneyProgress, PageJourneyProps } from './types';
import PageJourneyContext from './PageJourneyContext';
import PageJourneyContent from './PageJourneyContent';

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
    <div>
      <div className="flex gap-2 items-center mb-1.5 pb-2 tablet:hidden">
        {mobileHeaderStartSlot && (
          <div className="text-palette-primary-base dark:text-palette-primary-dark mr-3 pl-3">
            {mobileHeaderStartSlot}
          </div>
        )}
        <span className="text-font-neutral-base dark:text-font-neutral-dark">
          {currentTabStep.tabIndex} of {totalTabsSize}
        </span>
        <span className="font-semibold text-font-neutral-base dark:text-font-neutral-dark">
          {currentTabStep.tabLabel}
        </span>
        {mobileHeaderEndSlot && <div className="mr-3 pl-3">{mobileHeaderEndSlot}</div>}
      </div>
      <ul className="flex gap-3 mb-4 laptop:gap-6 tablet:gap-4">
        {tabs.map((tab, index) => (
          <li
            className="w-full whitespace-nowrap text-font-neutral-base dark:text-font-neutral-dark overflow-hidden"
            key={tab.id}
          >
            <div className="hidden tablet:flex tablet:gap-2 mb-1.5">
              <span>{index + 1}.</span>
              <span className="font-semibold dark:text-font-neutral-dark">{tab.label}</span>
            </div>
            <div className="relative h-1.5 tablet:h-2 w-full bg-background-base dark:bg-background-dark">
              <div
                className="h-full w-full bg-palette-primary-base dark:bg-palette-primary-dark"
                style={{ width: `${calculateProgress[tab.id] ?? 0}%` }}
                role="progressbar"
                aria-valuenow={calculateProgress[tab.id] ?? 0}
                aria-label={`${tab.label} progress`}
              ></div>
            </div>
          </li>
        ))}
      </ul>
      <PageJourneyContext.Provider value={{ currentTabStep: currentTabStep.componentKey }}>
        {children}
      </PageJourneyContext.Provider>
    </div>
  );
};

export default Object.assign(PageJourney, {
  PageJourneyContent,
});
