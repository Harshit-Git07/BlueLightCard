import { FC, useEffect, useState } from 'react';
import { CarouselProps } from './types';
import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
 * A carousel component that can be used to display a list of elements
 * @param elementsPerPageDesktop The number of elements to show at on desktop sized screens
 * @param elementsPerPageLaptop The number of elements to show on laptop sized screens
 * @param elementsPerPageTablet The number of elements to show on tablet sized screens
 * @param elementsPerPageMobile The number of elements to show on mobile sized screens
 * @param hidePillButtons Whether to hide the pill buttons
 * @param clickToScroll Whether to allow clicking on the carousel items to scroll to that item
 * @param loop Whether to loop the carousel
 * @param focusCenter Whether to hold the focused item at the center of the carousel
 * @param autoPlay Whether to automatically scroll the carousel
 * @param autoPlayIntervalMs The interval in milliseconds between each move
 * @param showControls Whether to show the controls at the side of the carouse
 * @param className The class name to apply to the carousel base
 * @param focusedClassName The class name to apply to the focused element
 * @param children The elements to display in the carousel
 * @return A carousel component
 */
const Carousel: FC<CarouselProps> = ({
  children,
  elementsPerPageDesktop = 5,
  elementsPerPageLaptop = 5,
  elementsPerPageTablet = 3,
  elementsPerPageMobile = 1,

  hidePillButtons = false,
  clickToScroll = false,
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

    setHorizontalOffset(`${(currentIndex * singleItemSize - offset) * -1}%`);
  }, [baseOffsetLooped, centeredOffset, currentIndex, focusCenter, loop, singleItemSize]);

  // Auto play
  useEffect(() => {
    if (autoPlay) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const interval = setInterval(() => {
        if (currentIndex < maxIndex) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(minIndex);
        }
      }, autoPlayIntervalMs);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayIntervalMs, currentIndex, maxIndex, minIndex]);

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
  const updateIndex = (index: number) => {
    if (index > maxIndex) {
      setCurrentIndex(maxIndex);
      return;
    }

    if (index < minIndex) {
      setCurrentIndex(minIndex);
      return;
    }

    setCurrentIndex(index);
  };

  // Controls for buttons
  const nextElement = () => {
    if (currentIndex >= maxIndex - 1) setCurrentIndex(minIndex);
    else setCurrentIndex(currentIndex + 1);
  };

  const prevElement = () => {
    if (currentIndex <= minIndex) setCurrentIndex(maxIndex);
    else setCurrentIndex(currentIndex - 1);
  };

  // A list of all the children formatted
  const childrenList = (takesFocus: boolean = false) => {
    return React.Children.map(children, (child, index) => {
      return (
        <div
          key={index}
          className={`${
            takesFocus && index === currentIndex ? focusedClassName : ''
          } w-full h-fit shrink-0 px-4 my-auto flex justify-center`}
          style={{ width: `${(1 / elementsShown) * 100}%` }}
          onClick={() => clickToScroll && updateIndex(index)}
        >
          {child}
        </div>
      );
    });
  };

  return (
    <div className={`${className} group w-full flex flex-col`}>
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
            className="flex relative transition-all duration-300 motion-reduce:duration-0"
            style={{ transform: `translate(${horizontalOffset}, 0)` }}
          >
            {childrenList(!loop)}
            {/* Add two more list if it's looping so that elements still show either side */}
            {loop && childrenList(true)}
            {loop && childrenList(false)}
          </div>
        </div>
      </div>

      {/* Pill buttons */}
      {!hidePillButtons && (
        <div className="flex justify-center pt-4">
          <div className="flex">
            {(() => {
              const options = [];

              for (let index = minIndex; index < maxIndex; index++) {
                options.push(
                  <div
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
    </div>
  );
};

export default Carousel;
