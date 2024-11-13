import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { Button, Heading } from '@bluelightcard/shared-ui';
import React, { FC } from 'react';

const lifecycleEvent = new InvokeNativeLifecycle();

type props = {
  message: string;
};

const CompanyPageError: FC<props> = ({ message }) => {
  return (
    <>
      <Heading headingLevel={'h2'} className="dark:text-white text-black pt-8">
        {message}
      </Heading>
      <Button type="link" href="/" onClick={() => lifecycleEvent.lifecycleEvent('onBackPressed')}>
        Return Home
      </Button>
    </>
  );
};

export default CompanyPageError;
