import React, { FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { ListSelectorProps, ListSelectorState } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { colours, fonts } from '../../tailwind/theme';

const ListSelector: FC<ListSelectorProps> = ({
  className = '',
  ariaLabel,
  title = '',
  state = ListSelectorState.Default,
  onClick,
  tag,
  description,
  showTrailingIcon = true,
}) => {
  const [currentState, setCurrentState] = useState(state);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(); // Call handleClick for keyboard events as well
    }
  };

  const handleClick = () => {
    // Set the state to Selected when clicked
    setCurrentState(ListSelectorState.Selected);

    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (currentState !== ListSelectorState.Selected) {
      setCurrentState(ListSelectorState.Hover);
    }
  };

  const handleMouseLeave = () => {
    setCurrentState(state);
  };

  const containerStyles = useMemo(() => {
    switch (currentState) {
      case ListSelectorState.Selected:
        return 'border border-colour-primary dark:border-colour-primary-dark bg-colour-surface-container-light dark:bg-colour-surface-container-dark';
      case ListSelectorState.Hover:
        return 'border border-colour-primary-hover dark:border-colour-primary-dark';
      default:
        return 'border border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark';
    }
  }, [currentState]);

  const iconColour =
    currentState === ListSelectorState.Selected
      ? 'text-colour-primary dark:text-colour-primary-dark'
      : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';

  return (
    <button
      className={`${className} ${containerStyles} w-full min-w-full sm:min-w-[500px] rounded-[4px] px-[16px] py-[12px] flex items-center justify-between transition-colors border`}
      aria-label={ariaLabel ?? `Button for ${title}`}
      role={onClick ? 'button' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-[4px] items-start w-full text-left">
        <div className="flex flex-row items-center flex-wrap gap-[8px] w-full">
          <h4
            className={`${colours.textOnSurface} ${fonts.bodySemiBold} break-words whitespace-normal`}
          >
            {title}
          </h4>

          {tag}
        </div>

        {description && (
          <p
            className={`${colours.textOnSurfaceSubtle} ${fonts.body} break-words whitespace-normal text-left`}
          >
            {description}
          </p>
        )}
      </div>

      {showTrailingIcon && (
        <FontAwesomeIcon
          className={`${iconColour} h-[20px]`}
          icon={currentState === ListSelectorState.Selected ? faPen : faArrowRight}
        />
      )}
    </button>
  );
};

export default ListSelector;
