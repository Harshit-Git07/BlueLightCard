export enum FileListItemStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  NONE = 'none',
}

export interface FileListItemProps {
  status?: FileListItemStatus;
  name: string;
  fileLink?: string;
  imageSrc?: string;
  showReUpload?: boolean;
  onClickReUpload?: () => void;
}

export interface StyledFLIIconProps {
  color?: string;
}

export interface StyledFLIContainerProps {
  color?: string;
}
