import Header from '@/components/Header/Header';
import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage<any> = () => (
  <>
    <Head>
      <title>Admin Panel CMS</title>
      <meta name="description" content={'Manage Offers & Companies'} />
    </Head>
    <main>
      <Header />
      <div className="p-4">
        <h1 data-testid="homePageHeading" className="text-2xl mb-2 font-semibold">
          Welcome to the Admin panel CMS
        </h1>
        <p>You will be able to manage companies and offers here.</p>
      </div>
    </main>
  </>
);

export default Home;
