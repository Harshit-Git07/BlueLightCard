import { faFileImage } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, DragEventHandler, FC, useState } from 'react';
import { FileUploadMimeTypes, FileUploadProps } from './types';

const filterFiles = (
  fileList: FileList,
  maxUploadSizeMb: number
): { successful: File[]; maxedFiles: File[] } => {
  const files = Array.from(fileList as ArrayLike<File>);
  const successful: File[] = [];
  const maxedFiles: File[] = [];
  files.forEach((file) => {
    const fileSizeMb = Number((file.size / 1024 ** 2).toPrecision(2));
    if (fileSizeMb > maxUploadSizeMb) {
      maxedFiles.push(file);
    } else {
      successful.push(file);
    }
  });
  return { successful, maxedFiles };
};

const FileUpload: FC<FileUploadProps> = ({
  allowMultiple,
  onError,
  onUpload,
  maxUploadSizeMb = 2,
  mimeTypes = [FileUploadMimeTypes.PNG, FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PDF],
  description = 'Place on a plain, well lit surface with no obstructions, blur or glare',
}) => {
  const [isDragEnter, setIsDragEnter] = useState(false);

  const mimeTypesString = mimeTypes.reduce((acc, type, index) => {
    if (index === mimeTypes.length - 1) {
      acc = acc.slice(0, -2);
      acc += ` or ${type.toUpperCase()}`;
    } else {
      acc += `${type.toUpperCase()}, `;
    }
    return acc;
  }, '');

  const mimeAcceptTypes = mimeTypes.map((type) => `.${type.toLocaleLowerCase()}`).join();

  const invokePropCallbacks = (fileList: FileList) => {
    const { successful, maxedFiles } = filterFiles(fileList, maxUploadSizeMb);
    if (onUpload && successful.length) {
      onUpload(successful);
    }
    if (onError && maxedFiles.length) {
      onError(maxedFiles);
    }
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.currentTarget;
    if (target.files) {
      invokePropCallbacks(target.files);
    }
  };

  const onDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragEnter(false);
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragEnter(true);
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      invokePropCallbacks(files);
    }
    setIsDragEnter(false);
  };

  return (
    <div
      className={`${
        isDragEnter ? 'bg-neutrals-type-1-200 ' : 'bg-neutrals-type-1-100 '
      }transition relative w-full content-center border-2 border-neutrals-type-1-400 rounded-md`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="p-5 text-center">
        <FontAwesomeIcon className="my-4 text-primary-type-1-base" icon={faFileImage} size="2x" />
        <div className="mb-5">
          <p>
            <span className="hidden tablet:inline">Drag your image here or</span>{' '}
            <span>
              <label className="underline text-link cursor-pointer" htmlFor="file-upload">
                upload a file
              </label>
              <input
                className="absolute top-0 left-0 opacity-0 invisible"
                type="file"
                id="file-upload"
                accept={mimeAcceptTypes}
                onChange={onFileChange}
                multiple={allowMultiple}
              />
            </span>
          </p>
          <p>
            It must be a {mimeTypesString} and no larger than {maxUploadSizeMb}mb
          </p>
        </div>
        <p className="opacity-50">{description}</p>
      </div>
    </div>
  );
};

export default FileUpload;
