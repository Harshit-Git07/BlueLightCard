import  Head  from 'next/head';
import { NextPage } from 'next';

const Home: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description"/>
      </Head>
      <main className="">
        <h1 className="text-2xl font-semibold">Mobile Hybrid</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore at magnam quo ullam perferendis excepturi deleniti architecto recusandae aut soluta.</p>
      </main>
    </>
  );
};

export default Home;
