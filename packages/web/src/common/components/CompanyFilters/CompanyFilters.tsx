import React, { FC } from 'react';
import PillButtons from '../PillButtons/PillButtons';

interface CompanyFiltersProps {}

// This component will receive prop to check pill that are disabled

const CompanyFilters: FC<CompanyFiltersProps> = () => {
  return (
    <div className="flex gap-[15px]">
      <PillButtons text={'All'} onSelected={() => void 0} />
      <PillButtons text={'Online'} onSelected={() => void 0} />
      <PillButtons text={'In-store'} onSelected={() => void 0} />
      <PillButtons text={'Gift Card'} onSelected={() => void 0} />
    </div>
  );
};

export default CompanyFilters;
