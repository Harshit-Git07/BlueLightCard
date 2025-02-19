import Content from '../RichtextModule/Content';
import Img from '@/ui/Img';
import React from 'react';
import SwiperCarousel from '@bluelightcard/shared-ui/components/SwiperCarousel';

export default function LogoList({
  pretitle,
  intro,
  logoType = 'default',
  logos,
}: Readonly<
  Partial<{
    pretitle: string;
    intro: any;
    logoType: 'default' | 'light' | 'dark';
    logos: Sanity.Logo[];
  }>
>) {
  return (
    <section className="section space-y-8">
      {(pretitle || intro) && (
        <header className="richtext text-center">
          <h2 className="text-center font-typography-display-medium font-typography-display-medium-weight text-typography-display-small leading-typography-display-medium">
            {pretitle}
          </h2>

          <Content value={intro} />
        </header>
      )}

      <figure className="item-center mx-auto flex flex-wrap justify-center gap-x-4 gap-y-8">
        <SwiperCarousel pagination elementsPerPageMobile={2}>
          {logos?.length &&
            logos.map((logo, key) => (
              <div className="w-full flex items-center justify-center" key={key}>
                <Img
                  className="max-h-[7em] max-w-[200px] object-contain"
                  image={logo.image?.[logoType] as Sanity.Image}
                  imageWidth={400}
                  key={key}
                />
              </div>
            ))}
        </SwiperCarousel>
      </figure>
    </section>
  );
}
