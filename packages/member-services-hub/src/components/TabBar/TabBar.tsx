import React, { FC, useState } from 'react';
import { TabBarProps, TabContentProps, TabItemProps } from './types';

const TabBar: FC<TabBarProps> = ({ items, defaultOpen, onTabClick, selected }) => {
  let [open, setOpen] = useState(defaultOpen);
  const TabItem: FC<TabItemProps> = ({ icon, title, category }) => {
    return (
      <button
        onClick={() => onTabClick(category)}
        className={`flex items-center border-b-2 py-3 px-6 text-sm font-medium md:text-base lg:py-4 lg:px-10 ${
          selected === category
            ? 'border-primary bg-opacity-10 text-palette-primary border-blue-900'
            : 'text-shade-greyscale-grey-500 border-[#FFFFFF] hover:border-primary hover:text-palette-primary'
        }`}
      >
        <div className="mr-2">{icon}</div>
        {title}
      </button>
    );
  };
  return (
    <section className="py-20 lg:py-[120px]">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="w-full mb-14">
              <div className="flex flex-wrap bg-[#FFFFFF] drop-shadow">
                {items.map((item, index) => (
                  <div key={`item-` + index.toString()}>
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
            </div>
          </div>
        </div>
      </div>
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
        {details}
      </div>
    </div>
  );
};
