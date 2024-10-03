import Heading from '@bluelightcard/shared-ui/components/Heading';
import { Button } from '@bluelightcard/shared-ui/index';
import React, { FC } from 'react';

type props = {
  message: string;
};

const CompanyPageError: FC<props> = ({ message }) => {
  return (
    <div className="w-full">
      <Heading headingLevel={'h2'} className="dark:text-white text-black pt-8">
        {message}
      </Heading>
      <Button href="/">Return Home</Button>
    </div>
  );
};

export default CompanyPageError;
