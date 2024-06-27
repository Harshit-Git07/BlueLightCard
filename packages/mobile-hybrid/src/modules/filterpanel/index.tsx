import { FC, MouseEventHandler, useCallback, useEffect } from 'react';
import FilterPillButton from '@/components/FilterPillButton/FilterPillButton';
import FilterHeader from '@/components/FilterHeader/FilterHeader';
import { useAtom } from 'jotai';
import { filters, isFilterPanelOpenAtom } from './store/filters';
import { OnFiltersCallback } from '@/components/FilterPillButton/types';
import { useFilters } from '@/hooks/useFilters';

const FilterPanel: FC = () => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useAtom(isFilterPanelOpenAtom);

  const { commit, save, reset, draft } = useFilters(filters);

  const onSelectedFilters = useCallback<OnFiltersCallback>(
    (filter) => {
      commit(filter, 'add');
    },
    [commit],
  );

  const onDeselectedFilters = useCallback<OnFiltersCallback>(
    (filter) => {
      commit(filter, 'remove');
    },
    [commit],
  );

  const onResetClick = useCallback(() => {
    if (draft.length === 0) return;
    reset();
  }, [draft.length, reset]);

  const onDoneClick = useCallback(() => {
    save();
    setIsFilterPanelOpen(false);
    if (draft.length === 0) {
      reset();
    }
  }, [draft.length, reset, save, setIsFilterPanelOpen]);

  const onModuleClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      if (event.target === event.currentTarget) {
        save();
        setIsFilterPanelOpen(false);
        if (draft.length === 0) {
          reset();
        }
      }
    },
    [draft.length, reset, save, setIsFilterPanelOpen],
  );

  useEffect(() => {
    setIsFilterPanelOpen(true);
  }, [setIsFilterPanelOpen]);

  return (
    <>
      <div
        onClick={onModuleClick}
        className={`absolute z-20 top-0 w-full  ${
          isFilterPanelOpen ? 'h-screen bg-neutral-black/40' : ''
        }`}
      >
        {isFilterPanelOpen && (
          <div className="fixed bottom-0 w-full ">
            <div>
              <FilterHeader
                onResetClick={onResetClick}
                onDoneClick={onDoneClick}
                resetEnabled={draft.length > 0}
              />
            </div>
            <div className="bottom-0 w-full pl-3 py-2 bg-neutral-white dark:bg-neutral-black">
              <FilterPillButton
                pills={[
                  {
                    text: 'Featured',
                    value: 'featured',
                  },
                  {
                    text: 'Popular',
                    value: 'popular',
                  },
                ]}
                selected={draft}
                onSelected={onSelectedFilters}
                onDeselected={onDeselectedFilters}
              />
              <h3 className="text-2xl ml-2 mt-6 mb-2 font-extrabold dark:text-primary-vividskyblue-700">
                Offer types
              </h3>
              <FilterPillButton
                pills={[
                  {
                    text: 'Online',
                    value: 'online',
                  },
                  {
                    text: 'High Street',
                    value: 'high street',
                  },
                  {
                    text: 'Gift Card',
                    value: 'gift card',
                  },
                  {
                    text: 'Local',
                    value: 'local',
                  },
                ]}
                selected={draft}
                onSelected={onSelectedFilters}
                onDeselected={onDeselectedFilters}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterPanel;
