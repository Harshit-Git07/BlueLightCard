// components/Layout.tsx
import Footer from '@/components/Footer/Footer';

import { LayoutProps } from './types';
import MetaData from '@/components/MetaData/MetaData';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../../components/Navigation/Navigation';

const BaseLayout: React.FC<LayoutProps> = ({ seo, children, translationNamespace }) => {
  return (
    <div>
      {seo && <MetaData seo={seo} translationNamespace={translationNamespace} />}
      <Navigation />
      <div>{children}</div>
      <ToastContainer
        transition={Slide}
        autoClose={4000}
        hideProgressBar
        className="!w-full !p-4"
        toastClassName="!bg-[#202125] !text-white !font-['MuseoSans'] !text-base !font-normal !rounded !px-4 !py-3.5"
        pauseOnHover={false}
      />
      <Footer isAuthenticated />;
    </div>
  );
};

export default BaseLayout;
