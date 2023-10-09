import React from 'react';

// eslint-disable-next-line react/display-name
const SvgrMock = ({ alt, ...props }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img alt={alt} {...props} />
);

export const ReactComponent = SvgrMock;
export default SvgrMock;
