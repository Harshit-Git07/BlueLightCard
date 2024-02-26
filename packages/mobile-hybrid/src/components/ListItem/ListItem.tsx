import { FC } from 'react';
import { ListItemProps } from './types';
import Image from '@/components/Image/Image';
import { cssUtil } from '@/utils/cssUtil';
import decodeEntities from '@/utils/decodeEntities';

const ListItem: FC<ListItemProps> = ({ title, text, imageSrc, imageAlt, className, onClick }) => {
  const rootClass = cssUtil(['flex', className ?? '', onClick ? 'cursor-pointer' : '']);
  return (
    <div className={rootClass} role={onClick ? 'button' : undefined} onClick={onClick}>
      {imageSrc && (
        <div className="relative md:w-[28%] md:pb-[14%] w-[45%] pb-[20%]">
          <Image
            src={imageSrc}
            responsive={true}
            alt={imageAlt ?? imageSrc}
            className="sm:object-cover object-contain rounded"
          />
        </div>
      )}
      <div className="flex flex-col justify-center pl-3 w-full">
        <h4 className="dark:text-neutral-white text-md mb-1 font-semibold font-museo leading-5 line-clamp-1 md:line-clamp-2">
          {decodeEntities(title)}
        </h4>
        {text && (
          <p className="text-neutral-grey-600 dark:text-neutral-grey-200 font-museo text-sm lg:text-lg">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListItem;
