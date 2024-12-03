import { UploadStatus } from '../../types';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { colours } from '../../../../tailwind/theme';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/pro-solid-svg-icons';

interface Result {
  icon: IconDefinition;
  iconColour: string;
  borderColour: string;
}

export function useStatusCardIconAndColours(uploadStatus: UploadStatus): Result {
  switch (uploadStatus) {
    case UploadStatus.Ready:
    case UploadStatus.Loading:
      return {
        icon: faSpinner,
        iconColour: colours.textPrimary,
        borderColour: colours.borderOnSurfaceOutline,
      };
    case UploadStatus.Success:
      return {
        icon: faCheckCircle,
        iconColour: colours.textSuccess,
        borderColour: colours.borderSuccess,
      };
    case UploadStatus.Error:
      return {
        icon: faXmarkCircle,
        iconColour: colours.textError,
        borderColour: colours.borderError,
      };
  }
}
