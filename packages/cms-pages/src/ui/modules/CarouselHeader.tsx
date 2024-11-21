import React from 'react';
import { cn } from '@/lib/utils';
import Img from '../Img';

export default function CarouselHeader({ title, image }: { title: string; image?: Sanity.Image }) {
  return (
    <div>
      <header className="my-5">
        <div className="text-2xl text-colour-onSurface-light dark:text-colour-onSurface-dark font-semibold text-left">
          {title}
        </div>
        {image != null && (
          <figure className={cn('max-md:full-bleed', 'md:order-1 mx-auto')}>
            <Img image={image} imageSizes={[320, 480, 640, 800, 960, 1280]} />
          </figure>
        )}
      </header>
    </div>
  );
}
