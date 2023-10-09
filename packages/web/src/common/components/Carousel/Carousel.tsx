import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { CarouselProps } from './types';
import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSwipeable } from 'react-swipeable';
import next from 'next/types';
import { set } from 'lodash';

const Pill: FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <div style={style} className={`${className} my-auto rounded-full mx-1`} />
);

/**
 ** A carousel component that can be used to display a list of elements
 ** @param elementsPerPageDesktop The number of elements to show at on desktop sized screens
 ** @param elementsPerPageLaptop The number of elements to show on laptop sized screens
 ** @param elementsPerPageTablet The number of elements to show on tablet sized screens
 ** @param elementsPerPageMobile The number of elements to show on mobile sized screens
 ** @param hidePillButtons Whether to hide the pill buttons
 ** @param clickToScroll Whether to allow clicking on the carousel items to scroll to that item
 ** @param loop Whether to loop the carousel
 ** @param focusCenter Whether to hold the focused item at the center of the carousel
 ** @param autoPlay Whether to automatically scroll the carousel
 ** @param autoPlayIntervalMs The interval in milliseconds between each move
 ** @param showControls Whether to show the controls at the side of the carouse
 ** @param className The class name to apply to the carousel base
 ** @param focusedClassName The class name to apply to the focused element
 ** @param children The elements to display in the carousel
 ** @return A carousel component
 **/
const Carousel: FC<CarouselProps> = ({
  children,
  elementsPerPageDesktop = 5,
  elementsPerPageLaptop = 5,
  elementsPerPageTablet = 3,
  elementsPerPageMobile = 1,

  hidePillButtons = false,
  clickToScroll = false,
  swipeToScroll = true,
  loop = false,
  focusCenter = false,
  autoPlay = false,
  autoPlayIntervalMs = 2000,
  showControls = false,
  className = '',
  focusedClassName = '',
}) => {
  // Info about the carousel elements
  const [elementsShown, setElementsShown] = useState(elementsPerPageDesktop); // Number of elements shown at once
  const [singleItemSize, setSingleItemSize] = useState((1 / elementsShown) * 100); // Size of elements as a percentage of the container
  const length = React.Children.count(children);

  // Offset to center the focused element
  const centeredOffset = Math.floor(elementsShown / 2) * singleItemSize;
  const baseOffsetLooped = 0 - singleItemSize * length; // Extra children are added before and after, so it is offsetted by a count of all chidlrento focus on the middle list of children

  // A max index and min index for the carousel, this is the last/first index that can be focused on, stops blank space either side of the carousel
  const maxIndex = loop
    ? length - 1
    : focusCenter
    ? length - Math.floor(elementsShown / 2)
    : length - elementsShown + 1;
  const minIndex = loop ? 0 : focusCenter ? Math.floor(elementsShown / 2) : 0;

  // Track current index and transform offset
  const [currentIndex, setCurrentIndex] = useState(minIndex);
  const [horizontalOffset, setHorizontalOffset] = useState('0%');

  // Update transition point
  useEffect(() => {
    let offset = 0;

    if (focusCenter) {
      offset += centeredOffset;
    }

    if (loop) {
      offset += baseOffsetLooped;
    }

    setHorizontalOffset(
      `calc(${(currentIndex * singleItemSize - offset) * -1}% - ${0.5 * currentIndex}rem)`
    );
  }, [baseOffsetLooped, centeredOffset, currentIndex, focusCenter, loop, singleItemSize]);

  // Manage shown elements based on break points
  useEffect(() => {
    const updateElementsShown = () => {
      if (window.innerWidth >= 1200) setElementsShown(elementsPerPageDesktop);
      else if (window.innerWidth >= 1024) setElementsShown(elementsPerPageLaptop);
      else if (window.innerWidth >= 768) setElementsShown(elementsPerPageTablet);
      else setElementsShown(elementsPerPageMobile);

      // Update item size to reflect new amount of elements shown
      setSingleItemSize((1 / elementsShown) * 100);
    };

    updateElementsShown();

    window.addEventListener('resize', updateElementsShown);

    return () => window.removeEventListener('resize', updateElementsShown);
  });

  // Update index if it is out of bounds, considering maxIndex
  const updateIndex = useCallback(
    (index: number) => {
      if (index > maxIndex) {
        setCurrentIndex(maxIndex - 1);
        return;
      }

      if (index < minIndex) {
        setCurrentIndex(minIndex);
        return;
      }

      setCurrentIndex(index);
    },
    [maxIndex, minIndex]
  );

  // Map of pill class sizes based on distance from current index. Used in mobile only pills
  const pillSizeMap = new Map<number, string>([
    [-2, 'h-2 w-2'],
    [-1, 'h-3 w-3'],
    [0, 'h-4 w-4'],
    [1, 'h-3 w-3'],
    [2, 'h-2 w-2'],
    [3, 'h-1 w-1'],
  ]);

  // Controls for buttons
  const nextElement = useCallback(() => {
    if (currentIndex >= maxIndex - 1) updateIndex(minIndex);
    else updateIndex(currentIndex + 1);
  }, [currentIndex, maxIndex, minIndex, updateIndex]);

  const prevElement = useCallback(() => {
    if (currentIndex <= minIndex) updateIndex(maxIndex - 1);
    else updateIndex(currentIndex - 1);
  }, [currentIndex, maxIndex, minIndex, updateIndex]);

  // Auto play
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        nextElement();
      }, autoPlayIntervalMs);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayIntervalMs, nextElement]);

  // A list of all the children formatted
  const childrenList = (takesFocus: boolean = false) => {
    return React.Children.map(children, (child, index) => {
      return (
        <div
          key={index}
          className={`${
            takesFocus && index === currentIndex ? focusedClassName : ''
          } w-full h-fit shrink-0 mb-auto flex justify-center mr-4`}
          // Add a fractional rem to account for padding
          style={{ width: `calc(${(1 / elementsShown) * 100}% - 0.5rem)` }}
          onClick={() => clickToScroll && updateIndex(index)}
        >
          {child}
        </div>
      );
    });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (swipeToScroll) nextElement();
    },
    onSwipedRight: () => {
      if (swipeToScroll) prevElement();
    },
  });

  /** For mobile only */
  const calculatedNumPillButtons = length - (length - maxIndex);
  const numPillButtonsToShow = calculatedNumPillButtons < 0 ? 0 : calculatedNumPillButtons;

  return (
    <div {...handlers} className={`${className} group w-full flex flex-col`}>
      {/* Carousel */}
      <div className="flex justify-center items-center relative">
        {/* Controls */}
        {showControls && (
          <>
            <div
              data-testid="prevEl"
              className="absolute left-0 flex h-full justify-center items-center"
              onClick={prevElement}
            >
              <div className="bg-[#000000cc] z-10 hidden group-hover:block rounded-md p-2 cursor-pointer">
                <FontAwesomeIcon icon={faChevronLeft} color="#ffffff" className="m-auto" />
              </div>
            </div>
            <div
              data-testid="nextEl"
              className="absolute right-0 flex h-full justify-center items-center"
              onClick={nextElement}
            >
              <div className="bg-[#000000cc] z-10 hidden group-hover:block  group-focus:block rounded-md p-2 cursor-pointer">
                <FontAwesomeIcon icon={faChevronRight} color="#ffffff" className="m-auto" />
              </div>
            </div>
          </>
        )}

        {/* Carousel children */}
        <div className={`w-full h-fit overflow-hidden`}>
          <div
            className="flex relative transition-all duration-500 motion-reduce:duration-0"
            style={{ transform: `translate(${horizontalOffset}, 0)` }}
          >
            {childrenList(!loop)}
            {/* Add two more list if it's looping so that elements still show either side */}
            {loop && childrenList(true)}
            {loop && childrenList(false)}
          </div>
        </div>
      </div>

      {/* Desktop Pill buttons */}
      {!hidePillButtons && (
        <div className="hidden laptop:flex justify-center pt-6">
          <div className="flex">
            {(() => {
              const options = [];

              for (let index = minIndex; index < maxIndex; index++) {
                options.push(
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
                      currentIndex === index ? 'bg-gray-400' : 'bg-gray-200'
                    }`}
                    onClick={() => updateIndex(index)}
                  />
                );
              }

              return options;
            })()}
          </div>
        </div>
      )}

      {/* Mobile Pill Buttons */}

      {!hidePillButtons && (
        <div className="block laptop:hidden pt-6 first-letter duration-1000">
          <div className={`flex justify-center`}>
            {[...Array(numPillButtonsToShow)].map((_, index) => {
              const diff = currentIndex - index;
              const size = pillSizeMap.get(diff) ?? 'h-0 w-0 opacity-0 mx-0';
              const currPill = currentIndex - minIndex;
              return (
                <Pill
                  key={index}
                  className={`${
                    currPill === index ? 'bg-surface-brand' : 'bg-gray-400'
                  } ${size} transition-all duration-500`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
