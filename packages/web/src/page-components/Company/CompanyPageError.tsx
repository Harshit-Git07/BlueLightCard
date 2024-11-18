import Heading from '@bluelightcard/shared-ui/components/Heading';
import { Button, Container, PlatformVariant } from '@bluelightcard/shared-ui/index';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

type props = {
  message: string;
};

const CompanyPageError: FC<props> = ({ message }) => {
  const isMobile = useMedia('(max-width: 500px)');

  return (
    <Container
      className="desktop:mt-16 mobile:mt-[14px]"
      platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
    >
      <Heading headingLevel={'h2'} className="dark:text-white text-black pt-8">
        {message}
      </Heading>
      <Button type="link" href="/">
        Return Home
      </Button>
    </Container>
  );
};

export default CompanyPageError;
