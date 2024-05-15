import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';
import { PlatformVariant, SharedProps } from '../../types';
import { ChangeEventHandler, FC } from 'react';

export type Props = SharedProps & {
  value?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const Search: FC<Props> = ({
  value,
  platform = PlatformVariant.MobileHybrid,
  placeholder = 'Search...',
  onChange,
}) => {
  const dynCss = useCSSConditional({
    'w-full p-3': platform === PlatformVariant.Web,
    'p-2': platform === PlatformVariant.MobileHybrid,
  });
  const css = useCSSMerge('border rounded-sm ring-offset-2 focus:outline-none focus:ring', dynCss);

  return (
    <input
      className={css}
      type="search"
      aria-label="Search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Search;
