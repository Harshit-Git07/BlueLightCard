import React from 'react';
import ContentLoader from 'react-content-loader';

function PromoBannerPlaceholder() {
  return (
    <div className="w-full relative mb-2">
      <ContentLoader
        speed={3}
        viewBox="0 0 600 200"
        backgroundColor="#f3f3f3"
        foregroundColor="#d1d1d1"
      >
        <rect x="0" y="0" rx="0" ry="0" width="600" height="200" />
      </ContentLoader>
    </div>
  );
}

export default PromoBannerPlaceholder;
