export enum FileUploadMimeTypes {
  PNG = 'png',
  JPEG = 'jpeg',
  PDF = 'pdf',
}

export interface StyledFUContainerProps {
  $isDragEnter?: boolean;
}

export interface FileUploadProps {
  description?: string;
  mimeTypes?: FileUploadMimeTypes[];
  maxUploadSizeMb?: number;
  allowMultiple?: boolean;
  onError?: (error: any) => void;
  onUpload?: (files: File[]) => void;
}
