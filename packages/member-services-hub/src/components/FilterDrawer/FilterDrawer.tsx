import { FC } from 'react';
import { FilterDrawerChildren, FilterDrawerProps } from './types';

const FilterDrawer: FC<FilterDrawerProps> = ({ heading, component, isOpen = false, setIsOpen }) => {
  return (
    <div data-testid="filter-drawer">
      <div
        onClick={() => setIsOpen(false)}
        data-testid="filter-drawer-toggle"
        className={`${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed right-0 top-0 h-full w-full cursor-pointer bg-neutral-500 transition-all duration-100 dark:bg-dark`}
      ></div>
      <div
        id="drawer-example"
        aria-labelledby="drawer-label"
        className={`${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed right-0 top-0 flex h-screen w-full max-w-[400px] flex-col justify-between overflow-y-auto bg-white px-5 py-9 dark:bg-dark-2 sm:px-9 text-[#212B36]`}
      >
        <button
          data-drawer-hide="drawer-example"
          aria-controls="drawer-example"
          className="absolute right-5 z-10 text-dark-5 hover:text-primary text-[#637381]"
          onClick={() => setIsOpen(false)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="M9.9 9.00001L16.7625 2.13751C17.0156 1.88439 17.0156 1.49064 16.7625 1.23751C16.5094 0.984387 16.1156 0.984387 15.8625 1.23751L9 8.10001L2.1375 1.23751C1.88437 0.984387 1.49062 0.984387 1.2375 1.23751C0.984372 1.49064 0.984372 1.88439 1.2375 2.13751L8.1 9.00001L1.2375 15.8625C0.984372 16.1156 0.984372 16.5094 1.2375 16.7625C1.35 16.875 1.51875 16.9594 1.6875 16.9594C1.85625 16.9594 2.025 16.9031 2.1375 16.7625L9 9.90001L15.8625 16.7625C15.975 16.875 16.1437 16.9594 16.3125 16.9594C16.4812 16.9594 16.65 16.9031 16.7625 16.7625C17.0156 16.5094 17.0156 16.1156 16.7625 15.8625L9.9 9.00001Z" />
          </svg>
        </button>
        <div>
          <form id="Filters">
            <div className="mb-[32px] flex justify-between border-b border-stroke dark:border-dark-3">
              <h3 className="mb-[16px] font-semibold text-dark">{heading}</h3>
            </div>
            {component &&
              component.map((item: FilterDrawerChildren) => (
                <div
                  key={item.title}
                  className="mb-[32px] flex justify-between border-b border-stroke dark:border-dark-3"
                >
                  <div className="w-full space-y-[20px] pb-[32px]">
                    <h3 className="mb-[16px] font-semibold text-dark text-left">{item.title}</h3>
                    {item.content &&
                      item.content.map((el: React.ReactElement) => {
                        return <div key={el.key}>{el}</div>;
                      })}
                  </div>
                </div>
              ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
