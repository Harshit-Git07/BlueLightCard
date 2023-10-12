import { GetStaticProps } from 'next';
import offersData from '../../../../data/offersData';

const getMobileSearchStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      offers: offersData.offerCategories[0].offers,
      pageTitle: 'Online Offers',
      offersHeading: 'Offers found',
      adverts: [],
    },
  };
};

export default getMobileSearchStaticProps;
