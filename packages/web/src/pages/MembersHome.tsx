import { NextPage } from 'next';
import React from 'react';
import homePageData from '../../data/homePageData.json';
import footerConfig from '../../data/footer.json';
import Image from 'next/image';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import Heading from '@/components/Heading/Heading';
import Carousel from '@/components/Carousel/Carousel';
import Footer from '@/components/Footer/Footer';

type BannerProps = {
  linkId: string;
  image: string;
  bannerType: string;
  legacyCompanyId: number;
  companyId: string;
  ageRestricted: boolean;
};

const Banner = ({
  linkId,
  image,
  bannerType,
  legacyCompanyId,
  companyId,
  ageRestricted,
}: BannerProps) => {
  return (
    <div className="w-full relative">
      <Image
        src={image}
        alt=""
        width="0"
        height="0"
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={`${className} px-2 tablet:px-8 laptop:px-64 py-4 w-full`}>{children}</div>
      <hr />
    </>
  );
};

const PseudoCarousel = ({
  title,
  itemsToShow,
  offers,
}: {
  title: string;
  itemsToShow: number;
  offers: { offerName: string; companyName: string; image: string }[];
}) => {
  return (
    <>
      <Heading headingLevel="h2">{title}</Heading>
      <Carousel
        showControls
        autoPlay
        elementsPerPageDesktop={itemsToShow}
        elementsPerPageLaptop={itemsToShow}
        elementsPerPageMobile={1}
        elementsPerPageTablet={2}
      >
        {offers.map((offer, index) => {
          return (
            <Card key={index} className="w-full">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={offer.image}
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h4 className="font-bold text-large">{offer.companyName}</h4>
                <small className="text-default-500">{offer.offerName}</small>
              </CardBody>
            </Card>
          );
        })}
      </Carousel>
    </>
  );
};

const HomePage: NextPage<any> = (props) => {
  // Unpack data
  // TODO: Wrap in layout

  const { banners, dealsOfTheWeek, flexible, marketplace, featured, footer } = props;
  return (
    <>
      <Container>
        <Carousel
          autoPlay
          showControls
          elementsPerPageLaptop={1}
          elementsPerPageDesktop={1}
          elementsPerPageTablet={1}
          elementsPerPageMobile={1}
        >
          {banners.map((banner: any, index: number) => {
            return <Banner key={index} {...banner} />;
          })}
        </Carousel>
      </Container>

      <Container className="flex flex-col">
        <PseudoCarousel title="Deals of the week" itemsToShow={2} offers={dealsOfTheWeek} />
      </Container>

      <Container className="flex flex-col">
        <PseudoCarousel
          title="Ways to save"
          itemsToShow={3}
          offers={flexible.map((offer: any) => {
            return {
              offerName: offer.intro,
              image: offer.imagedetail,
              companyName: '',
            };
          })}
        />
      </Container>

      {marketplace.map((menu: any, index: number) => {
        return (
          <Container key={index}>
            <PseudoCarousel title={menu.name} itemsToShow={3} offers={menu.items} />
          </Container>
        );
      })}

      <Container className="flex flex-col">
        <PseudoCarousel title="Featured Offers" itemsToShow={3} offers={featured} />
      </Container>

      <Footer {...footer} />
    </>
  );
};

export async function getStaticProps(context: any) {
  // Pull in the dummy data
  // Format data
  // Pass data through
  return {
    props: {
      banners: homePageData[0].banners,
      dealsOfTheWeek: homePageData[0].deals,
      flexible: homePageData[0].flexible,
      marketplace: homePageData[0].marketplace,
      featured: homePageData[0].featured,
      footer: footerConfig.footer,
    },
  };
}

export default HomePage;
