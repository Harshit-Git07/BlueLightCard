import { FC } from 'react';
import { FileListItemProps, FileListItemStatus } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decider } from '@/utils/decider';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { faFile } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { cssUtil } from '@/utils/cssUtil';
import { ASSET_PREFIX } from '@/global-vars';

const FileListItem: FC<FileListItemProps> = ({
  status,
  name,
  showReUpload,
  fileLink,
  imageSrc,
  imageWidth,
  imageHeight,
  imageSizes,
  assetPrefix = ASSET_PREFIX,
}) => {
  const icon = decider([
    [status === FileListItemStatus.SUCCESS, faCheckCircle],
    [status === FileListItemStatus.ERROR, faExclamationCircle],
  ]);
  const textColor = decider([
    [status === FileListItemStatus.SUCCESS, 'text-fileListItem-success'],
    [status === FileListItemStatus.ERROR, 'text-fileListItem-danger'],
  ]);
  const borderColor = decider([
    [status === FileListItemStatus.SUCCESS, 'border-fileListItem-success'],
    [status === FileListItemStatus.ERROR, 'border-fileListItem-danger'],
  ]);
  const containerClasses = cssUtil([
    'max-w-[700px]',
    borderColor ?? 'border-fileListItem-border-base',
    'flex flex-col justify-center w-full rounded-lg border',
  ]);
  const wrapperClasses = cssUtil([
    !!imageSrc ? 'gap-2' : 'gap-4 tablet:flex-row items-center',
    'flex flex-col py-3 px-5',
  ]);
  const prefixIconClasses = cssUtil([textColor ?? '', 'block']);
  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        <div className="flex items-center gap-4 flex-1">
          {icon && <FontAwesomeIcon className={prefixIconClasses} icon={icon} />}
          <FontAwesomeIcon icon={faFile} />
          <span className="flex-1">{name}</span>
        </div>
        {imageSrc && (
          <div className="flex items-center gap-4 flex-1 pb-2 border-b-2 border-fileListItem-border-image">
            <div className="relative pb-[64%] w-full bg-fileListItem-bg-image text-center">
              <Image
                className="max-w-full object-contain"
                src={`${assetPrefix}/${imageSrc}`}
                alt={name}
                sizes={imageSizes}
                fill={!!(!imageWidth && !imageHeight)}
                unoptimized
                width={imageWidth}
                height={imageHeight}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 flex-1 self-center tablet:justify-end tablet:self-end">
          {fileLink && (
            <Link className="no-underline p-0.5" href={fileLink}>
              View
            </Link>
          )}
          {showReUpload && (
            <button className="text-link transition rounded-md ring-offset-4 hover:opacity-75 focus:ring-2">
              Re-upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileListItem;
