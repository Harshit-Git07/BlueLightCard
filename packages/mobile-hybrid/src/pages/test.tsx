import  Head  from 'next/head';
import { NextPage } from 'next';
import Card from '@/components/Card/Card';


const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description"/>
      </Head>
      <section className='flex justify-start flex-wrap bg-neutral-white dark:bg-neutral-black'>
        <Card title={'10% off at Adidas'} text={'Adidas'} imageSrc='/card_test_img.jpg' onClick={(isSelected) => {
          console.log('Card clicked!', isSelected);
        }}/>
        <a href=""><Card title={'Save up to 10% on new products'} text={'Apple'} imageSrc='/card_test_img.jpg'/></a>
        <a href=""><Card title={'10% off at Adidas and more at blue light card'} text={'Adidas'} imageSrc='/card_test_img.jpg'/></a>
        <a href=""><Card title={'10% off at Adidas and more at blue light card'} text={'Adidas'} imageSrc='/card_test_img.jpg'/></a>
        <Card title={'10% off at Adidas'} text={'Adidas'} imageSrc='/card_test_img.jpg'/>
        <Card title={'10% off at Adidas'} text={'Adidas'} imageSrc='/card_test_img.jpg'/>
        <Card title={'10% off at Adidas'} text={'Adidas'} imageSrc='/card_test_img.jpg'/>
      </section>
    </>
  );
};

export default TestPage;
