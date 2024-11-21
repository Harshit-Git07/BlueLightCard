'use client';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import CompanyCard from './CompanyCard';
import CarouselHeader from './CarouselHeader';
import { RandomAutoplay } from '../utils/Autoplay';

export default function CompanyCarousel({
  menu,
}: Partial<{
  menu: Sanity.MenuCompany;
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
                menu.inclusions.map((inclusion, index) => {
                  const company = inclusion;
                  const brandDetails = company?.brandCompanyDetails?.[0];
                  return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <CompanyCard
                        image={brandDetails?.companyLogo?.default as Sanity.Image}
                        companyId={company?._id ?? ''}
                        companyName={brandDetails?.companyName ?? 'Unknown Company'}
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
