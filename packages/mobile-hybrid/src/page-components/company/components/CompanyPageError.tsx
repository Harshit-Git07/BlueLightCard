import { useSetAtom } from 'jotai';
import React, { FC, useEffect } from 'react';
import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { spinner } from '@/modules/Spinner/store';
import { Button, Heading } from '@bluelightcard/shared-ui';

const lifecycleEvent = new InvokeNativeLifecycle();

type props = {
  message: string;
};

const CompanyPageError: FC<props> = ({ message }) => {
  const backEvent = () => {
    try {
      lifecycleEvent.lifecycleEvent('onBackPressed');
    } catch (e) {
      console.error(e);
    }
  };

  const setSpinner = useSetAtom(spinner);
  useEffect(() => {
    setSpinner(false);
  }, [setSpinner]);

  return (
    <>
      <Heading headingLevel={'h2'} className="dark:text-white text-black pt-8">
        {message}
      </Heading>
      <Button onClick={backEvent}>Return Home</Button>
    </>
  );
};

export default CompanyPageError;
