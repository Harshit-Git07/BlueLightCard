import React, { FC, useState } from 'react';
import { TabBarProps, TabContentProps, TabItemProps } from './types';
import { string } from 'zod';
import { cssUtil } from '@/app/common/utils/cssUtil';

const TabBar: FC<TabBarProps> = ({ items, defaultOpen, onTabClick, selected }) => {
  let [open, setOpen] = useState(defaultOpen);
  const TabItem: FC<TabItemProps> = ({ icon, title, category }) => {
    return (
      <div className="justify-center items-center gap-2 flex">
        <div className="relative flex-col justify-start items-start flex">
          <button
            onClick={() => onTabClick(category)}
            className={cssUtil([
              'flex border-b-1 font-semibold min-w-[150px] h-[60px] justify-center items-center',
              selected === category
                ? 'border-primary bg-opacity-10 text-palette-primary border-blue-900'
                : 'text-shade-greyscale-grey-500 border-[#FFFFFF] hover:border-primary hover:text-palette-primary',
            ])}
          >
            <div className="mr-2">{icon}</div>
            {title}
          </button>
        </div>
      </div>
    );
  };
  return (
    <section className="h-[60px]">
      <div className="flex flex-wrap bg-[#FFFFFF] drop-shadow-[1px_1px_1px_rgba(0,0,0,0.12)]">
        {items.map((item, index) => (
          <div
            key={`item-` + index.toString()}
            className="w-150 justify-center items-center inline-flex"
          >
            <TabItem
              icon={item.icon}
              category={item.category}
              title={item.title}
              open={selected}
              details={item.details}
            />
          </div>
        ))}
      </div>
      {items.map((item, index) => (
        <div key={`item-detail-` + index.toString()}>
          <TabContent details={item.details} open={selected} tabCategory={item.category} />
        </div>
      ))}
    </section>
  );
};

export default TabBar;

const TabContent: FC<TabContentProps> = ({ open, tabCategory, details }) => {
  return (
    <div>
      <div
        className={`text-body-color p-6 text-base leading-relaxed ${
          open === tabCategory ? 'block' : 'hidden'
        } `}
      >
        {typeof details === 'string' ? details : details({})}
      </div>
    </div>
  );
};
