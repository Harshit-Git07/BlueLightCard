import { FC } from 'react';
import ContentLoader from 'react-content-loader';
import { PromoBannerPlaceholderProps } from './types';

const PromoBannerPlaceholder: FC<PromoBannerPlaceholderProps> = ({ variant = 'large' }) => {
  let viewBox = '';

  if (variant === 'large') viewBox = '0 0 600 200';
  if (variant === 'small') viewBox = '0 0 600 100';

  return (
    <div className="w-full relative mb-2">
      <ContentLoader
        speed={3}
        viewBox={viewBox}
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
      >
        <rect x="0" y="0" rx="0" ry="0" width="600" height="200" />
      </ContentLoader>
    </div>
  );
};

export default PromoBannerPlaceholder;
