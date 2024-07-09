import { FC } from 'react';
import { HeadingProps } from './types';

const Heading: FC<HeadingProps> = ({ title, size, onClickSeeAll }) => {
  return (
    <div className="flex w-full content-center my-2 px-4">
      <h2 className="font-heading-font font-heading-font-weight text-heading-font tracking-heading-font leading-heading-font flex-1 text-heading-colour-light dark:text-heading-colour-dark">
        {title}
      </h2>
      {onClickSeeAll && (
        <button
          className="font-heading-link-font font-heading-link-font-weight text-heading-link-font tracking-heading-link-font leading-heading-link-font text-heading-link-colour dark:text-heading-link-colour-dark"
          onClick={onClickSeeAll}
        >
          See all
        </button>
      )}
    </div>
  );
};

export default Heading;
