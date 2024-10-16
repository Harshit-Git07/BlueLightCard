import { FC } from 'react';
import ContentLoader from 'react-content-loader';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';

export type OfferCardPlaceholderProps = {
  columns: number;
  variant: 'vertical' | 'horizontal';
};

export const OfferCardPlaceholder: FC<OfferCardPlaceholderProps> = ({
  columns,
  variant = 'vertical',
}) => {
  const dynCss: string = useCSSConditional({
    'grid-cols-3 gap-x-6 gap-y-4': columns === 3 && variant === 'vertical',
    'grid-cols-2 gap-x-6 gap-y-14': columns === 2 && variant === 'vertical',
    'grid-cols-1 gap-y-6': columns === 1 && variant === 'vertical',
    'grid-cols-1': columns === 1 && variant === 'horizontal',
  });
  const css = useCSSMerge(
    'grid w-full rounded-lg shadow-md dark:bg-surface-secondary-dark overflow-hidden',
    dynCss,
  );

  const renderContentLoader = () => {
    const loaders = [];
    for (let i = 0; i < columns; i++) {
      loaders.push(
        <ContentLoader
          key={i}
          speed={3}
          viewBox="0 0 300 200"
          backgroundColor="#f3f3f3"
          foregroundColor="#d1d1d1"
        >
          <rect x="0" y="0" rx="0" ry="0" width="300" height="150" />
        </ContentLoader>,
      );
    }
    return loaders;
  };

  return (
    <div data-testid={'offer-card-placeholder'} className={css}>
      {renderContentLoader()}
    </div>
  );
};

export default OfferCardPlaceholder;
