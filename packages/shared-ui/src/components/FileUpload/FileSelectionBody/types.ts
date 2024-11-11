export interface FileSelectionProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  allowedFileTypes?: string[]; // e.g. ['image/png', 'image/jpeg']
  maxFileSize?: number;
}
