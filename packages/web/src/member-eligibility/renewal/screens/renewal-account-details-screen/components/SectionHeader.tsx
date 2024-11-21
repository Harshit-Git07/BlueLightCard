import React, { FC } from 'react';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-[4px] pb-[12px]">
      <p className={`${fonts.bodySmallSemiBold} ${colours.textOnSurface}`}>{title}</p>

      <p className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>{description}</p>
    </div>
  );
};
