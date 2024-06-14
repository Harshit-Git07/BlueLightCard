import { FC } from 'react';
import { ListItemProps } from './types';
import Image from '@/components/Image/Image';
import { cssUtil } from '@/utils/cssUtil';
import decodeEntities from '@/utils/decodeEntities';
import { fallbackImage } from '@/constants';

const ListItem: FC<ListItemProps> = ({ title, text, imageSrc, imageAlt, className, onClick }) => {
  const rootClass = cssUtil(['flex', className ?? '', onClick ? 'cursor-pointer' : '']);

  return (
    <div className={rootClass} role={onClick ? 'button' : undefined} onClick={onClick}>
      <div className="relative md:w-[28%] md:pb-[14%] w-[50%] pb-[20%]">
        <Image
          src={imageSrc || fallbackImage}
          responsive={true}
          alt={imageAlt ?? (imageSrc || fallbackImage)}
          className="sm:object-cover object-contain rounded"
        />
      </div>
      <div className="flex flex-col justify-center pl-3 w-full">
        <h4 className="text-listItem-title-colour-light dark:text-listItem-title-colour-dark text-md mb-1 font-semibold font-museo leading-5 line-clamp-1 md:line-clamp-2">
          {decodeEntities(title)}
        </h4>
        {text && (
          <p className="text-listItem-text-colour-light dark:text-listItem-text-colour-dark font-museo text-listItem-text-font lg:text-lg">
            {decodeEntities(text)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListItem;
