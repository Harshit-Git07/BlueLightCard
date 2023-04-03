import { desktopSmall } from '@/utils/breakpoints';
import { faFileImage } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';
import { FileUploadMimeTypes, FileUploadProps } from './types';

const StyledFUContainer = styled(Card)`
  width: 100%;
  justify-content: center;
  background-color: var(--bs-tertiary-color);
  border: 2px solid var(--bs-border-color);
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

const FileUpload: FC<FileUploadProps> = ({
  maxUploadSize = '20mb',
  mimeTypes = [FileUploadMimeTypes.PNG, FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PDF],
  description = 'Place on a plain, well lit surface with no obstructions, blur or glare',
}) => {
  const mimeTypesString = mimeTypes.reduce((acc, type, index) => {
    if (index === mimeTypes.length - 1) {
      acc += `or ${type.toUpperCase()}`;
    } else {
      acc += `${type.toUpperCase()}, `;
    }
    return acc;
  }, '');
  return (
    <StyledFUContainer>
      <StyledFUContent>
        <StyledFUIcon icon={faFileImage} size="2x" />
        <StyledFUMessage>
          <p>
            <StyledFUDesktopMessage>Drag your image here</StyledFUDesktopMessage> or{' '}
            <span>
              <StyledFUInputFileLabel htmlFor="file-upload">upload a file</StyledFUInputFileLabel>
              <StyledFUInputFile type="file" id="file-upload" />
            </span>
          </p>
          <p>
            It must be a {mimeTypesString} and no larger than {maxUploadSize}
          </p>
        </StyledFUMessage>
        <StyledFUDescription>{description}</StyledFUDescription>
      </StyledFUContent>
    </StyledFUContainer>
  );
};

export default FileUpload;
