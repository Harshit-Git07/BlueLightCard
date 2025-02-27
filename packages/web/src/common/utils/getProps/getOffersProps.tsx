import { GetStaticProps } from 'next';
import offersData from '@/data/offersData';
/**
 * Loads in offer data based off query params.
 * @TODO Pull data from dynamo via gql
 * @TODO Add category logic
 * @returns
 */
const getOffersStaticProps: GetStaticProps = async () => {
  // Query params - Hardcoded as using params is not viable.
  const offerType = 2;
  const searchQuery = undefined;
  const categoryQuery = undefined;

  // Search query provided, default to search
  if (searchQuery) {
    return {
      props: {
        offersHeading: `Search results for: ${searchQuery}`,
        offers: offersData.offerCategories[0].offers, // Uses the first category for demo
      },
    };
  }

  // Category id provided
  if (categoryQuery) {
    return {
      props: {
        offersHeading: `Children and toys`,
        offers: offersData.offerCategories[1].offers, // Uses the first category for demo
      },
    };
  }

  // Offer Preset Pages (online, highstreet, giftcard)
  const offersFilter = offersData.offerCategories.filter((offerCat) => {
    return offerCat.offerIndex == offerType;
  });

  if (offersFilter.length <= 0) {
    return { notFound: true };
  }

  const offer = offersFilter[0];

  return {
    props: {
      ...offer,
    },
  };
};

export default getOffersStaticProps;
