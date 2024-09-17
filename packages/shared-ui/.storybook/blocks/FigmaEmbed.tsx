import React, { FC, useContext } from 'react';
import { DocsContext } from '@storybook/blocks';

const FigmaEmbed: FC = () => {
  const context = useContext(DocsContext);

  const { story } = context.resolveOf('story', ['story']);
  const { parameters } = story;

  return (
    <iframe
      style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
      width="100%"
      height="600"
      src={parameters.design.url}
      allowFullScreen={true}
    ></iframe>
  );
};

export default FigmaEmbed;
