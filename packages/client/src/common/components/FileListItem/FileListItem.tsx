import { FC } from 'react';
import {
  FileListItemProps,
  FileListItemStatus,
  StyledFLIContainerProps,
  StyledFLIProps,
  StyledFLIIconProps,
} from './types';
import styled, { css } from 'styled-components';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decider } from '@/utils/decider';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { faFile } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { tablet } from '@/utils/breakpoints';

const StyledFLIContainer = styled(Card)<StyledFLIContainerProps>`
  width: 100%;
  justify-content: center;
  border: 1px solid var(${(props) => props.color ?? '--file-list-item-default-color'});
`;

const StyledFLIContent = styled(Card.Body)<StyledFLIProps>`
  padding: 0.8rem 1.2rem;
  flex: none;
  display: flex;
  align-items: ${(props) => (props.$imageView ? 'unset' : 'center')};
  gap: ${(props) => (props.$imageView ? '0.5rem' : '1rem')};
  flex-direction: column;
  ${(props) =>
    props.$imageView &&
    css`
      flex-direction: column;
    `};
  ${(props) =>
    !props.$imageView &&
    css`
      @media only screen and (min-width: ${tablet}) {
        flex-direction: row;
      }
    `}
`;

const StyledFLIIcon = styled(FontAwesomeIcon)<StyledFLIIconProps>`
  display: block;
  font-size: 1.4rem;
  color: var(${(props) => props.color ?? '--file-list-item-default-color'});
`;

const StyledFLIName = styled.span`
  flex: 1;
`;

const StyledFLIButton = styled(Button)`
  padding: 0.1rem;
  text-decoration: none;
`;

const StyledFLIImageContainer = styled.div`
  position: relative;
  padding-bottom: 64%;
  width: 100%;
  background-color: var(--bs-tertiary-color);
  text-align: center;
  border-bottom: 1px solid var(--file-list-item-image-border-color);
  img {
    max-width: 100%;
    object-fit: contain;
  }
`;

const StyledFLIContentRow = styled.div<StyledFLIProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  ${(props) =>
    props.$alignRight &&
    css`
      align-self: center;
      @media only screen and (min-width: ${tablet}) {
        justify-content: flex-end;
        align-self: flex-end;
      }
    `}
`;

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
  const color = decider([
    [status === FileListItemStatus.SUCCESS, '--file-list-item-success-color'],
    [status === FileListItemStatus.ERROR, '--file-list-item-error-color'],
  ]);
  return (
    <StyledFLIContainer color={color}>
      <StyledFLIContent $imageView={!!imageSrc}>
        <StyledFLIContentRow>
          {icon && <StyledFLIIcon icon={icon} color={color} />}
          <FontAwesomeIcon icon={faFile} />
          <StyledFLIName>{name}</StyledFLIName>
        </StyledFLIContentRow>
        {imageSrc && (
          <StyledFLIContentRow>
            <StyledFLIImageContainer>
              <Image
                loader={imageLoader}
                src={imageSrc}
                alt={name}
                sizes={imageSizes}
                fill={!!(!imageWidth && !imageHeight)}
                width={imageWidth}
                height={imageHeight}
              />
            </StyledFLIImageContainer>
          </StyledFLIContentRow>
        )}
        <StyledFLIContentRow $alignRight={true}>
          {fileLink && (
            <StyledFLIButton variant="link" href={fileLink}>
              View
            </StyledFLIButton>
          )}
          {showReUpload && <StyledFLIButton variant="link">Re-upload</StyledFLIButton>}
        </StyledFLIContentRow>
      </StyledFLIContent>
    </StyledFLIContainer>
  );
};

export default FileListItem;
