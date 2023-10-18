import BaseLayout from '@/layouts/BaseLayout/BaseLayout';
import { ReactElement } from 'react';

function generateBaseLayout(props: any) {
  const PageComponent = (page: ReactElement) => {
    return <BaseLayout {...props}>{page}</BaseLayout>;
  };

  return PageComponent;
}

export default generateBaseLayout;
