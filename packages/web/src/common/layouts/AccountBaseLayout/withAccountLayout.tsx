import { NextPage } from 'next';
import { NextPageWithLayout } from '../../page-types/layout';
import generateAccountBaseLayout from './generateAccountBaseLayout';

const withAccountLayout = (content: React.FC<any> | NextPage<any>, props?: any) => {
  const Page: NextPageWithLayout<any> = () => {
    const Content = content;

    return (
      <div>
        <Content />
      </div>
    );
  };

  Page.getLayout = generateAccountBaseLayout(props);

  return Page;
};

export default withAccountLayout;
