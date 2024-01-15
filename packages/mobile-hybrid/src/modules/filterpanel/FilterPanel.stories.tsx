import { Meta, StoryFn } from '@storybook/react';
import FilterPanel from './index';
import Filter from '@/components/Filter/Filter';
import { useAtom, useAtomValue } from 'jotai';
import { filters, isFilterPanelOpenAtom } from '@/modules/filterpanel/store/filters';

const componentMeta: Meta<typeof FilterPanel> = {
  title: 'Modules/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof FilterPanel> = (args) => {
  const [isFilterPanelOpen, setFilterPanelOpen] = useAtom(isFilterPanelOpenAtom);
  const _filters = useAtomValue(filters);

  const onFilterClick = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  return (
    <div>
      <Filter onClick={onFilterClick} filterCount={_filters.length} />
      {isFilterPanelOpen && <FilterPanel {...args} />}
    </div>
  );
};

export const Default = Template.bind({});

export default componentMeta;
