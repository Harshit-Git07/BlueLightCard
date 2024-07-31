import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { Button, Heading } from '@bluelightcard/shared-ui';
import React from 'react';

const lifecycleEvent = new InvokeNativeLifecycle();

const CompanyPageError = () => {
  return (
    <>
      <Heading headingLevel={'h2'} className="dark:text-white text-black pt-8">
        Something went wrong. Please try again later
      </Heading>
      <Button onClick={() => lifecycleEvent.lifecycleEvent('onBackPressed')}>Return Home</Button>
    </>
  );
};

export default CompanyPageError;
