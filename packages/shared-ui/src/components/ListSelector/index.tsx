import React, { FC, useState, useEffect, KeyboardEvent } from 'react';
import { ListSelectorProps, ListSelectorState } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faPen } from '@fortawesome/pro-solid-svg-icons';

const ListSelector: FC<ListSelectorProps> = ({
  ariaLabel,
  title,
  state = ListSelectorState.Default,
  onClick,
  tag,
  description,
  showTrailingIcon = true,
  className = '',
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

  const getStyles = () => {
    switch (currentState) {
      case ListSelectorState.Selected:
        return 'border border-colour-primary dark:border-colour-primary-dark bg-colour-surface-container-light dark:bg-colour-surface-container-dark';
      case ListSelectorState.Hover:
        return 'border border-colour-primary-hover dark:border-colour-primary-dark';
      default:
        return 'border border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark';
    }
  };

  const iconColour =
    currentState === ListSelectorState.Selected
      ? 'text-colour-primary dark:text-colour-primary-dark'
      : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';

  return (
    <button
      aria-label={ariaLabel ?? `Button for ${title}`}
      className={`${className} w-full rounded-lg px-4 py-3 flex items-center justify-between transition-colors border ${getStyles()} min-w-full sm:min-w-[500px]`}
      role={onClick ? 'button' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-start w-full text-left">
        <div className="flex items-center gap-2 w-full">
          <h4 className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold leading-typography-body-semibold break-words whitespace-normal">
            {title}
          </h4>

          {tag && <span>{tag}</span>}
        </div>

        {description && (
          <p className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body break-words whitespace-normal text-left">
            {description}
          </p>
        )}
      </div>

      {showTrailingIcon && (
        <FontAwesomeIcon
          icon={currentState === ListSelectorState.Selected ? faPen : faArrowRight}
          className={`h-5 ${iconColour}`}
        />
      )}
    </button>
  );
};

export default ListSelector;
