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
  imageWidth?: number;
  imageHeight?: number;
  imageSizes?: string;
  showReUpload?: boolean;
  assetPrefix?: string;
  onClickReUpload?: () => void;
}

export interface StyledFLIIconProps {
  color?: string;
}

export interface StyledFLIContainerProps {
  color?: string;
}

export interface StyledFLIProps {
  $imageView?: boolean;
  $alignRight?: boolean;
}
