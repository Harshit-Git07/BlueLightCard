import React, { KeyboardEvent } from 'react';
import { PillGroupProps, PillProps } from './types';
import PillButtons from '../PillButtons';
import { PlatformVariant } from '../../../src/types';

const PillGroup: React.FC<PillGroupProps> = ({ pillGroup, onSelectedPill, title }) => {
  const handlePillKeyDown = (event: KeyboardEvent) => {
    const previousKeys = ['ArrowLeft', 'ArrowUp'];
    if (previousKeys.includes(event.key) && event.currentTarget.previousElementSibling) {
      (event.currentTarget.previousElementSibling as HTMLElement).focus();
    }

    const nextKeys = ['ArrowRight', 'ArrowDown'];
    if (nextKeys.includes(event.key) && event.currentTarget.nextElementSibling) {
      (event.currentTarget.nextElementSibling as HTMLElement).focus();
    }

    const resetKeys = ['ArrowRight', 'ArrowDown', 'Tab'];
    if (resetKeys.includes(event.key) && !event.currentTarget.nextElementSibling) {
      (event.currentTarget.parentElement?.firstChild as HTMLElement)?.focus();
    }
  };

  return (
    <div className="w-full">
      <p
        className="py-1.5 mb-2 font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large text-colour-onSurface-light dark:text-colour-onSurface-dark
        tablet:font-typography-headline-weight tablet:font-typography-headline tablet:text-typography-headline tablet:tracking-typography-headline tablet:leading-typography-headline"
      >
        {title}
      </p>
      <div className="flex gap-[15px] flex-wrap">
        {pillGroup.map((pill: PillProps, index) => (
          <PillButtons
            key={pill.id}
            text={pill.label}
            tabIndex={index}
            onSelected={() => onSelectedPill(pill)}
            onKeyDown={handlePillKeyDown}
            isSelected={pill.selected}
            platform={PlatformVariant.MobileHybrid}
          />
        ))}
      </div>
    </div>
  );
};

export default PillGroup;
