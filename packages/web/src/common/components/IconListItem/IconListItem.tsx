import React, { FC } from 'react';
import { IconListItemProps } from './types';
import Image from '../Image/Image';
import Link from '../Link/Link';

const IconListItem: FC<IconListItemProps> = ({
  iconSrc,
  emoji,
  title,
  link,
  onClickLink,
  href,
  useLegacyRouting = false,
}) => {
  const renderLink = () => {
    if (onClickLink) {
      return (
        <Link onClickLink={onClickLink} useLegacyRouting={false}>
          {link}
        </Link>
      );
    }
    if (href) {
      return (
        <Link href={href} useLegacyRouting={useLegacyRouting}>
          {link}
        </Link>
      );
    }
  };

  return (
    <div className={`w-full flex gap-3 px-4 py-3 ${link ? '' : 'items-center'}`}>
      <div className="w-[20px]">
        {iconSrc ? (
          <Image src={iconSrc} alt={title} fill={false} width={20} height={20} />
        ) : emoji ? (
          <p>{emoji}</p>
        ) : null}
      </div>
      <div className="flex flex-col">
        <p className="font-['MuseoSans'] text-sm text-[#202125] font-normal">{title}</p>
        {link && renderLink()}
      </div>
    </div>
  );
};

export default IconListItem;
