'use client';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { RandomAutoplay } from '../utils/Autoplay';
import CarouselHeader from './CarouselHeader';
import OfferCollectionCard from './OfferCollectionCard';

export default function CollectionCarousel({
  menu,
}: Partial<{
  menu: Sanity.MenuThemedOffer;
}>) {
  if (menu == null) return null;
  return (
    <div className="flex justify-center items-center bg-gray-50 border">
      <section className="w-5/6 my-10">
        <CarouselHeader title={menu.title} image={menu.image?.default as Sanity.Image} />

        <div className="mx-auto">
          <Carousel
            plugins={[RandomAutoplay()]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-5/6 mx-auto"
          >
            <CarouselContent>
              {menu.inclusions &&
                menu.inclusions?.map((inclusion, index) => {
                  const offerCollectionDetails = inclusion;
                  return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <OfferCollectionCard
                        name={offerCollectionDetails.offerCollectionName}
                        id={menu._id}
                        offerCollectionKey={inclusion._key}
                        image={offerCollectionDetails.offerCollectionImage.default as Sanity.Image}
                      />
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
