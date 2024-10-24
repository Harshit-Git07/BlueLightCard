import { colours, fonts } from '../../tailwind/theme';
import { conditionalStrings } from '../../utils/conditionalStrings';

export const getClasses = (isOpen: boolean, isPartOfAGroup: boolean) => {
  const allStates = true;
  const isOpenAndGrouped = isOpen && isPartOfAGroup;
  const isClosedAndGrouped = !isOpen && isPartOfAGroup;

  const borderStyle = `border-b border-size-[1px] ${colours.borderOnSurfaceOutline}`;

  const accordionClasses = 'px-[16px]';

  const buttonClasses = conditionalStrings({
    [`flex justify-between items-center w-full py-[10px] text-left gap-[16px] ${colours.textOnSurface}`]:
      allStates,
    'mb-[16px]': isClosedAndGrouped,
    [borderStyle]: !isPartOfAGroup || isClosedAndGrouped,
  });

  const titleClasses = conditionalStrings({
    'whitespace-normal text-ellipses line-clamp-2': allStates,
    [fonts.bodySemiBold]: isPartOfAGroup,
    [fonts.body]: !isPartOfAGroup,
  });

  const contentWrapperClasses = conditionalStrings({
    'overflow-hidden transition-[height] duration-200 ease-in-out': allStates,
    [borderStyle]: isOpenAndGrouped,
  });

  const contentClasses = `pb-[24px] ${fonts.bodyLight} ${colours.textOnSurface}`;

  return { accordionClasses, buttonClasses, titleClasses, contentWrapperClasses, contentClasses };
};

export default getClasses;
