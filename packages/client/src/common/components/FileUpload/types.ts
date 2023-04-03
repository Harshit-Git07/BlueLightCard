export enum FileUploadMimeTypes {
  PNG = 'png',
  JPEG = 'jpeg',
  PDF = 'pdf',
}

export interface FileUploadProps {
  description?: string;
  mimeTypes?: FileUploadMimeTypes[];
  maxUploadSize?: string;
}
