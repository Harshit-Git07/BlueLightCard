'use client';
import React from 'react';
import OfferCard from './OfferCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { RandomAutoplay } from '../utils/Autoplay';
import CarouselHeader from './CarouselHeader';

export default function OffersCarousel({
  menu,
}: Partial<{
  menu: Sanity.MenuOffer;
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
                  const offer = inclusion;
                  return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <OfferCard offer={offer} companyId={offer?.company?._id ?? ''} />
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
