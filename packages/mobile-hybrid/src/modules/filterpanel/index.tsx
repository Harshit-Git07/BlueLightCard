import { FC } from 'react';
import { FilterPanelProps } from './types';
import FilterPillButton from '@/components/FilterPillButton/FilterPillButton';
import FilterHeader from '@/components/FilterHeader/FilterHeader';
import PromoBanner from '../promobanner';
import Card from '@/components/Card/Card';

const FilterPanel: FC<FilterPanelProps> = ({ onClose }) => {
  return (
    <>
      <div className="absolute h-screen w-full opacity-30"></div>
      <div className="absolute dark:bg-neutral-black bg-neutral-white pb-4 bottom-0 w-full">
        <div>
          <FilterHeader
            onResetClick={() => console.log('reset')}
            onDoneClick={onClose}
            resetEnabled
          />
        </div>
        <div className="bottom-0 w-full pl-3 py-2">
          <FilterPillButton
            pills={[
              {
                text: 'Featured',
                value: '5',
              },
              {
                text: 'Popular',
                value: '6',
              },
            ]}
          />
          <h3 className="text-2xl ml-2 mt-6 mb-2 font-museo font-extrabold dark:text-primary-vividskyblue-700">
            Offer types
          </h3>
          <FilterPillButton
            pills={[
              {
                text: 'Online',
                value: '1',
              },
              {
                text: 'High Street',
                value: '2',
              },
              {
                text: 'Gift Card',
                value: '3',
              },
              {
                text: 'Local',
                value: '4',
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
