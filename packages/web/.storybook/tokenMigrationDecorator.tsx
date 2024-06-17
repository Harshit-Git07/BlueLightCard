import React from 'react';
import { env } from '@bluelightcard/shared-ui/env';
import { Decorator } from '@storybook/react';

/**
 * Displays a message indicating that the components are using new tokens
 * @TODO Remove once migration has been accomplished
 * @param Story
 * @returns
 */
const tokenMigrationDecorator: Decorator = (Story) => (
  <div>
    {env.FLAG_NEW_TOKENS ? (
      <h2 className="p-2 text-colour-onSurface dark:text-colour-onSurface-dark bg-colour-surface-container dark:bg-colour-surface-container-dark border-2 border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark mb-5">
        Component with new tokens
      </h2>
    ) : null}
    <Story />
  </div>
);

export default tokenMigrationDecorator;
