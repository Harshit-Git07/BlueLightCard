import { FC } from 'react';
import { HeadingProps } from './types';

const Heading: FC<HeadingProps> = ({ title, size, onClickSeeAll }) => {
  return (
    <div className="flex w-full content-center my-2 px-4">
      <h2
        className={`${
          size === 'small' ? 'text-lg' : 'text-2xl'
        } font-heading-font font-extrabold flex-1 text-heading-colour-light dark:text-heading-colour-dark`}
      >
        {title}
      </h2>
      {onClickSeeAll && (
        <button
          className="font-heading-link-font font-semibold text-heading-link-colour-light dark:text-heading-link-colour-dark"
          onClick={onClickSeeAll}
        >
          See all
        </button>
      )}
    </div>
  );
};

export default Heading;
