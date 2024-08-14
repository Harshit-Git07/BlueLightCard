import React from 'react';
import ContentLoader from 'react-content-loader';

function OfferCardPlaceholder() {
  return (
    <div
      data-testid={'offer-card-placeholder'}
      className="w-full h-fit rounded-lg relative shadow-md dark:bg-surface-secondary-dark pb mb-2 overflow-hidden"
    >
      <ContentLoader
        speed={3}
        viewBox="0 0 300 250"
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
      >
        <rect x="0" y="0" rx="0" ry="0" width="300" height="150" />
        <rect x="5" y="160" rx="10" ry="10" width="250" height="16" />
        <rect x="5" y="185" rx="5" ry="5" width="290" height="8" />
        <rect x="5" y="200" rx="5" ry="5" width="250" height="8" />
        <rect x="5" y="215" rx="5" ry="5" width="275" height="8" />
      </ContentLoader>
    </div>
  );
}

export default OfferCardPlaceholder;
