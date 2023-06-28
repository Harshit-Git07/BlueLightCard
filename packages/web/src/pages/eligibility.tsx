import Navigation from '@/components/NavigationLegacy/Navigation';
import { NextPage } from 'next';

const TestPage: NextPage = () => {
  return (
    <main>
      <Navigation
        logoImgSrc="blc_logo.webp"
        assetPrefix=""
        navItems={[
          {
            link: '/',
            text: 'Home',
          },
          {
            link: '/',
            text: 'About us',
          },
          {
            link: '/',
            text: 'Add your business',
          },
          {
            link: '/',
            text: 'FAQs',
          },
        ]}
      />
      <div className="mt-[10rem] text-center">
        <h1 className="text-7xl">Testing reverse proxy</h1>
      </div>
    </main>
  );
};

export default TestPage;
