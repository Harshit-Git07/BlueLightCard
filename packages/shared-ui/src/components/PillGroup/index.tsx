import React, { useState } from 'react';
import { PillGroupProps, PillProps } from './types';
import PillButtons from '../PillButtons';
import { PlatformVariant } from '../../../src/types';

const PillGroup: React.FC<PillGroupProps> = ({ pillGroup, onSelectedPill, title }) => {
  const [selectedPillId, setSelectedPillId] = useState<string | null>(null);

  const handlePillClick = (pillId: string) => {
    setSelectedPillId(pillId);
    onSelectedPill(Number(pillId));
  };

  return (
    <div className="w-full">
      <p className="py-1.5 mb-2 font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large text-colour-onSurface-light dark:text-colour-onSurface-dark">
        {title}
      </p>
      <div className="flex gap-[15px] flex-wrap">
        {pillGroup.map((pill: PillProps) => (
          <PillButtons
            key={pill.id}
            text={pill.label}
            onSelected={() => handlePillClick(pill.id.toString())}
            isSelected={selectedPillId === pill.id.toString()}
            platform={PlatformVariant.MobileHybrid}
          />
        ))}
      </div>
    </div>
  );
};

export default PillGroup;
