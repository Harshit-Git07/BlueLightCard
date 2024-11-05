import React, { FC } from 'react';
import { BreadcrumbsProps } from './types';

const Breadcrumbs: FC<BreadcrumbsProps> = ({ trail }) => {
  return (
    <div className="py-10 bg-white dark:bg-dark" data-testid="breadcrumbs">
      <div className="container">
        <div className="w-full mb-8">
          <div className="px-4 py-4 bg-white border rounded-lg border-light dark:bg-dark-2 dark:border-dark-3 shadow-1 dark:shadow-card sm:px-6 md:px-8 md:py-5">
            <ul className="flex items-center">
              {trail.map((breadcrumb, index) => (
                <li key={index} className="flex items-center">
                  {index === trail.length - 1 ? (
                    <span className="text-base font-medium text-primary font-bold dark:text-primary">
                      {breadcrumb.name}
                    </span>
                  ) : (
                    <a
                      href={breadcrumb.href}
                      className="text-base font-medium hover:text-primary dark:hover:text-primary text-dark"
                    >
                      {breadcrumb.name}
                    </a>
                  )}
                  {index < trail.length - 1 && (
                    <span className="px-3 text-body-color dark:text-dark-6">&gt;</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
