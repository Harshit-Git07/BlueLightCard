import { FC } from 'react';
import Image from '@/components/Image/Image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { HortizontalCardProps } from './types';

/*
 * A horizontal 'list' card component that can be used to display a list of tabs for a mobile view
 * @param img - The image to display on the card
 * @param title - The title to display on the card
 * @param description - OPTIONAL -The description to display on the card
 * @param link The link to navigate - when the card is clicked
 * @return A horizontal card component
 */

const HorizontalCard: FC<HortizontalCardProps> = ({ img, title, description, link }) => {
  const chevronRight = <FontAwesomeIcon icon={faChevronRight} />;
  return (
    // Link imported from next/link
    // tabIndex is used to make the card focusable
    <Link href={link}>
      <div
        tabIndex={0}
        className="mobile:pl-3 mobile:py-3  flex border-gray-400-30 focus:dark:bg-surface-secondary-dark dark:border-white dark:bg-palette-secondary-on-dark"
        data-testid="horizontalCard"
      >
        <div className="w-2/5 flex justify-center items-center">
          <div className="mb-auto rounded-4 w-full">
            {/* image imported from components folder */}
            <Image
              src={img}
              alt={title}
              className="rounded-4 w-full h-full object-contain max-h-full"
              width={150}
              height={100}
              responsive={false}
            />
          </div>
        </div>
        <div className="mx-3 flex w-full justify-between">
          <div className="flex-col mb-auto">
            <h2 className="uppercase text-gray-400">{title}</h2>
            {/* Description is optional */}
            <p className="text-gray-800 dark:text-white leading-5">{description}</p>
          </div>
          <div className="px-5 my-auto text-gray-400">{chevronRight}</div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalCard;
