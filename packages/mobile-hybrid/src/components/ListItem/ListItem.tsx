import { FC } from 'react';
import { ListItemProps } from './types';
import Image from '@/components/Image/Image';
import { cssUtil } from '@/utils/cssUtil';

const ListItem: FC<ListItemProps> = ({ title, text, imageSrc, imageAlt, className, onClick }) => {
  const rootClass = cssUtil(['flex gap-1', className ?? '', onClick ? 'cursor-pointer' : '']);
  return (
    <div className={rootClass} role={onClick ? 'button' : undefined} onClick={onClick}>
      {imageSrc && (
        <Image
          src={imageSrc}
          width={110}
          height={73}
          responsive={false}
          alt={imageAlt ?? imageSrc}
          className="rounded-sm"
        />
      )}
      <div className="pl-3">
        <h4 className="dark:text-neutral-white text-lg mb-1 font-semibold font-museo leading-5">
          {title}
        </h4>
        {text && <p className="text-gray-400 text-md">{text}</p>}
      </div>
    </div>
  );
};

export default ListItem;
