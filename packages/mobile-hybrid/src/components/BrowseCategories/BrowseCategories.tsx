import React, { FC, Fragment } from 'react';
import ContentLoader from 'react-content-loader';
import useCategoriesData from '@/hooks/useCategoriesData';
import { PillGroup } from '@bluelightcard/shared-ui';
import { IS_SSR } from '@/globals';
import { BrowseCategoriesProps } from './types';

const Skeleton: FC = () => (
  <div className="my-6 mx-4">
    <ContentLoader height={400} width={400} viewBox="0 0 400 400" style={{ margin: 0, padding: 0 }}>
      {Array.from({ length: 7 }, (_, index) => (
        <Fragment key={index}>
          <rect y={index * 50} rx="20" ry="20" width="180" height="40" />
          <rect y={index * 50} x="190" rx="20" ry="20" width="180" height="40" />
        </Fragment>
      ))}
    </ContentLoader>
  </div>
);

const BrowseCategories: FC<BrowseCategoriesProps> = ({ onCategoryClick }) => {
  const { data: categories, isLoading, isError } = useCategoriesData();

  const onPillClick = (pill: { id: number | string; label: string }) =>
    onCategoryClick({ id: pill.id.toString(), name: pill.label });

  if (IS_SSR || isLoading || isError || !categories) return <Skeleton />;

  return (
    <div className="my-6 mx-4">
      <PillGroup
        title="Browse Categories"
        pillGroup={categories.map((category) => ({
          id: category.id,
          label: category.name,
          selected: false,
        }))}
        onSelectedPill={onPillClick}
      />
    </div>
  );
};

export default BrowseCategories;
