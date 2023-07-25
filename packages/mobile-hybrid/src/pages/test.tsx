import  Head  from 'next/head';
import { NextPage } from 'next';
import Button from '@/components/Button/Button';


const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description"/>
      </Head>
      <div className='flex flex-col w-full h-screen dark:bg-neutral-black'>
     <Button text={'Login'} />
     <Button text={'Add to Savings'} disabled/>
     </div>
    </>
  );
};

export default TestPage;
