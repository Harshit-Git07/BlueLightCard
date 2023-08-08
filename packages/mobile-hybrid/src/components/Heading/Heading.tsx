import { FC } from 'react';
import { HeadingProps } from './types';

const Heading: FC<HeadingProps> = ({ title, onClickSeeAll }) => {
  return (
    <div className="flex w-full content-center my-2 px-4 text-primary-dukeblue-700 dark:text-primary-vividskyblue-700">
      <h2 className="text-2xl font-museo font-extrabold flex-1">{title}</h2>
      {onClickSeeAll && (
        <button className="font-museo font-semibold" onClick={onClickSeeAll}>
          See all
        </button>
      )}
    </div>
  );
};

export default Heading;
