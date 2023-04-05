import { FC } from 'react';
import {
  FileListItemProps,
  FileListItemStatus,
  StyledFLIContainerProps,
  StyledFLIIconProps,
} from './types';
import styled from 'styled-components';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decider } from '@/utils/decider';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { faFile } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';
import Image, { ImageLoader } from 'next/image';

const StyledFLIContainer = styled(Card)<StyledFLIContainerProps>`
  width: 100%;
  justify-content: center;
  border: 1px solid var(${(props) => props.color ?? '--file-list-view-default-color'});
`;

const StyledFLIContent = styled(Card.Body)`
  padding: 0.8rem 1.2rem;
  flex: none;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledFLIIcon = styled(FontAwesomeIcon)<StyledFLIIconProps>`
  display: block;
  font-size: 1.4rem;
  color: var(${(props) => props.color ?? '--file-list-view-default-color'});
`;

const StyledFLIName = styled.span`
  flex: 1;
`;

const StyledFLIButton = styled(Button)`
  padding: 0.1rem;
  text-decoration: none;
`;

const StyledFLIImageContainer = styled.div``;

const imageLoader: ImageLoader = ({ src }) => `http://localhost:6006${src}`;

const FileListItem: FC<FileListItemProps> = ({
  status,
  name,
  showReUpload,
  fileLink,
  imageSrc,
}) => {
  const icon = decider([
    [status === FileListItemStatus.SUCCESS, faCheckCircle],
    [status === FileListItemStatus.ERROR, faExclamationCircle],
  ]);
  const color = decider([
    [status === FileListItemStatus.SUCCESS, '--file-list-view-success-color'],
    [status === FileListItemStatus.ERROR, '--file-list-view-error-color'],
  ]);
  return (
    <StyledFLIContainer color={color}>
      <StyledFLIContent>
        {icon && <StyledFLIIcon icon={icon} color={color} />}
        <FontAwesomeIcon icon={faFile} />
        <StyledFLIName>{name}</StyledFLIName>
        {fileLink && (
          <StyledFLIButton variant="link" href={fileLink}>
            View
          </StyledFLIButton>
        )}
        {imageSrc && <Image loader={imageLoader} src={imageSrc} alt={name} fill={true} />}
        {showReUpload && <StyledFLIButton variant="link">Re-upload</StyledFLIButton>}
      </StyledFLIContent>
    </StyledFLIContainer>
  );
};

export default FileListItem;
