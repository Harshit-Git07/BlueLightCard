import React, { FC, useContext } from 'react';
import { DocsContext } from '@storybook/blocks';

const ComponentStatus: FC = () => {
  const context = useContext(DocsContext);

  const { story } = context.resolveOf('story', ['story']);
  const { parameters } = story;
  const { status } = parameters;

  let statusLabel = '❓ Unknown';
  let statusText = 'This component has not been given a status, why not add one?';
  let statusColour = 'lightgrey';

  if (status === 'unimplemented') {
    statusLabel = '❌ Unimplemented';
    statusText = 'This component has not yet been implemented and is awaiting development.';
    statusColour = 'salmon';
  }

  if (status === 'wip') {
    statusLabel = '🔨 In Progress';
    statusText =
      'This component is currently in progress, there may still be further changes to come and it may not yet be ready for use in production.';
    statusColour = 'orange';
  }

  if (status === 'done') {
    statusLabel = '✅ Done';
    statusText = 'This component has been fully implemented and is ready for use in production.';
    statusColour = 'lightgreen';
  }

  return (
    <div
      style={{
        backgroundColor: statusColour,
        borderRadius: '4px',
        padding: '12px',
        marginBottom: '12px',
      }}
    >
      <b style={{ margin: 0 }}>{statusLabel}</b>
      <p style={{ margin: 0 }}>{statusText}</p>
    </div>
  );
};

export default ComponentStatus;
