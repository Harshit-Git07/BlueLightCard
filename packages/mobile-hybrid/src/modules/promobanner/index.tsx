import { FC } from 'react';
import useOffers from '@/hooks/useOffers';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';

const navigation = new InvokeNativeNavigation();

interface PromoBannerDeal {
  text: string;
  imageSrc: string;
  id: number;
}

const PromoBanner: FC = () => {
  const onSlideItemClick = (id: string) => {
    navigation.navigate(`/offerdetails.php?cid=${id}`);
  };
  const { deals } = useOffers();
  const promoImages: PromoBannerDeal[] = deals.reduce((acc, deal) => {
    const items = deal.items;

    items.forEach(({ image, s3logos, offername: text, compid: id }) => {
      acc.push({ imageSrc: image?.length ? image : s3logos, text, id });
    });
    return acc;
  }, [] as PromoBannerDeal[]);

  return (
    <>
      {!!promoImages.length && (
        <BannerCarousel slides={promoImages} onSlideItemClick={onSlideItemClick} />
      )}
    </>
  );
};

export default PromoBanner;
