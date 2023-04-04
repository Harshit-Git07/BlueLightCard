import { faFileImage } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, FC, useState } from 'react';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';
import { desktopSmall } from '@/utils/breakpoints';
import { FileUploadMimeTypes, FileUploadProps, StyledFUContainerProps } from './types';

const StyledFUContainer = styled(Card)<StyledFUContainerProps>`
  width: 100%;
  justify-content: center;
  background-color: var(
    ${(props) => (props.$isDragEnter ? '--file-upload-drag-enter-color' : '--bs-tertiary-color')}
  );
  border: 2px solid var(--bs-border-color);
  transition: background-color 0.2s;
`;

const StyledFUContent = styled(Card.Body)`
  padding: 1.2rem;
  text-align: center;
  flex: none;
  p {
    margin-bottom: 0.2rem;
  }
`;

const StyledFUDesktopMessage = styled.span`
  display: none;
  @media only screen and (min-width: ${desktopSmall}) {
    display: inline;
  }
`;

const StyledFUMessage = styled.div`
  color: var(--file-upload-message-color);
  margin-bottom: 1.3rem;
`;

const StyledFUIcon = styled(FontAwesomeIcon)`
  color: var(--bs-primary);
  margin: 1rem 0;
`;

const StyledFUDescription = styled.p`
  font-size: var(--font-size-body-medium);
  color: var(--file-upload-description-color);
`;

const StyledFUInputFile = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  visibility: hidden;
`;

const StyledFUInputFileLabel = styled.label`
  text-decoration: underline;
  color: var(--bs-link-color);
  cursor: pointer;
`;

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

  const onDragEnter = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const onDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragEnter(false);
  };

  const onDragOver = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragEnter(true);
  };

  const onDrop = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      invokePropCallbacks(files);
    }
    setIsDragEnter(false);
  };

  return (
    <StyledFUContainer
      $isDragEnter={isDragEnter}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <StyledFUContent>
        <StyledFUIcon icon={faFileImage} size="2x" />
        <StyledFUMessage>
          <p>
            <StyledFUDesktopMessage>Drag your image here or</StyledFUDesktopMessage>{' '}
            <span>
              <StyledFUInputFileLabel htmlFor="file-upload">upload a file</StyledFUInputFileLabel>
              <StyledFUInputFile
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
        </StyledFUMessage>
        <StyledFUDescription>{description}</StyledFUDescription>
      </StyledFUContent>
    </StyledFUContainer>
  );
};

export default FileUpload;
