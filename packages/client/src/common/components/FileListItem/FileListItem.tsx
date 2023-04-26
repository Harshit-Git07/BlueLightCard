import { FC } from 'react';
import { FileListItemProps, FileListItemStatus } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decider } from '@/utils/decider';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { faFile } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

const FileListItem: FC<FileListItemProps> = ({
  status,
  name,
  showReUpload,
  fileLink,
  imageSrc,
  imageWidth,
  imageHeight,
  imageSizes,
  imageLoader,
}) => {
  const icon = decider([
    [status === FileListItemStatus.SUCCESS, faCheckCircle],
    [status === FileListItemStatus.ERROR, faExclamationCircle],
  ]);
  const textColor = decider([
    [status === FileListItemStatus.SUCCESS, 'text-semantic-success-base'],
    [status === FileListItemStatus.ERROR, 'text-semantic-danger-base'],
  ]);
  const borderColor = decider([
    [status === FileListItemStatus.SUCCESS, 'border-semantic-success-base'],
    [status === FileListItemStatus.ERROR, 'border-semantic-danger-base'],
  ]);
  return (
    <div
      className={`${
        borderColor ? `${borderColor} ` : 'border-neutrals-type-1-base '
      }flex flex-col justify-center w-full rounded-lg border`}
    >
      <div
        className={`${
          !!imageSrc ? 'gap-2 ' : 'gap-4 tablet:flex-row items-center '
        }flex flex-col py-3 px-5`}
      >
        <div className="flex items-center gap-4 flex-1">
          {icon && (
            <FontAwesomeIcon className={`${textColor ? `${textColor} ` : ''}block`} icon={icon} />
          )}
          <FontAwesomeIcon icon={faFile} />
          <span className="flex-1">{name}</span>
        </div>
        {imageSrc && (
          <div className="flex items-center gap-4 flex-1 pb-2 border-b-2 border-neutrals-type-1-base">
            <div className="relative pb-[64%] w-full bg-neutrals-type-1-200 text-center">
              <Image
                className="max-w-full object-contain"
                loader={imageLoader}
                src={imageSrc}
                alt={name}
                sizes={imageSizes}
                fill={!!(!imageWidth && !imageHeight)}
                width={imageWidth}
                height={imageHeight}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 flex-1 self-center tablet:justify-end tablet:self-end">
          {fileLink && (
            <Link className="text-primary-type-1-base no-underline p-0.5" href={fileLink}>
              View
            </Link>
          )}
          {showReUpload && (
            <button className="text-primary-type-1-base transition rounded-md ring-offset-4 hover:opacity-75 focus:ring-2">
              Re-upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileListItem;
