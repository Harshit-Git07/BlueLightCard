import BaseLayout from '@/layouts/BaseLayout/BaseLayout';
import { ReactElement } from 'react';

function getBaseLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
}

export default getBaseLayout;
