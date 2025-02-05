import { FC, useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import Tag from '@bluelightcard/shared-ui/components/Tag';
import { ListSelectorProps } from '@bluelightcard/shared-ui/components/ListSelector/types';
import { TagProps } from '@bluelightcard/shared-ui/components/Tag/types';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

interface VerificationMethodDetails {
  firstVerificationMethod: Details;
  secondVerificationMethod?: Details;
}

type Details = Pick<ListSelectorProps, 'title' | 'description' | 'tag' | 'showTrailingIcon'>;

export function useVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): VerificationMethodDetails {
  return {
    firstVerificationMethod: useFirstVerificationMethodDetails(eligibilityDetails),
    secondVerificationMethod: useSecondVerificationMethodDetails(eligibilityDetails),
  };
}

function useFirstVerificationMethodDetails(eligibilityDetails: EligibilityDetails): Details {
  const title = useMemo(() => {
    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return eligibilityDetails.fileVerificationType[0];
    }

    return eligibilityDetails.fileVerificationType ?? 'Unknown verification method selected';
  }, [eligibilityDetails.fileVerificationType]);

  const description = useMemo(() => {
    return getGuidelinesDescription(eligibilityDetails);
  }, [eligibilityDetails]);

  const tag = useMemo(() => {
    if (title === 'SPPA Headed Letter') {
      return <VerificationMethodDetailsTag infoMessage="Primary document" />;
    }

    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return <VerificationMethodDetailsTag infoMessage="Primary document" />;
    }

    return undefined;
  }, [eligibilityDetails.fileVerificationType, title]);

  const showTrailingIcon = useMemo(() => {
    if (title === 'SPPA Headed Letter') {
      return true;
    }

    return !Array.isArray(eligibilityDetails.fileVerificationType);
  }, [eligibilityDetails.fileVerificationType, title]);

  return {
    title,
    description,
    tag,
    showTrailingIcon,
  };
}

function useSecondVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): Details | undefined {
  const title = useMemo(() => {
    if (
      !Array.isArray(eligibilityDetails.fileVerificationType) ||
      eligibilityDetails.fileVerificationType.length !== 2
    ) {
      return undefined;
    }

    if (eligibilityDetails.fileVerificationType[0] === 'SPPA Headed Letter') {
      return 'Secondary document';
    }

    return eligibilityDetails.fileVerificationType[1];
  }, [eligibilityDetails.fileVerificationType]);

  const description = useMemo(() => {
    if (eligibilityDetails.fileVerificationType?.[0] === 'SPPA Headed Letter') {
      return (
        <>
          One of:
          <br />
          - Certificate of discharge
          <br />
          - Certificate of Service
          <br />
          - NARF ID Card
          <br />
          - P60
          <br />- Pension document
        </>
      );
    }

    return getGuidelinesDescription(eligibilityDetails, 1);
  }, [eligibilityDetails]);

  const tag = useMemo(() => {
    return <VerificationMethodDetailsTag infoMessage="Supporting document" />;
  }, []);

  const showTrailingIcon = useMemo(() => {
    return eligibilityDetails.fileVerificationType !== 'SPPA Headed Letter';
  }, [eligibilityDetails.fileVerificationType]);

  if (!title) return undefined;

  return {
    title,
    description,
    tag,
    showTrailingIcon,
  };
}

function getGuidelinesDescription(
  eligibilityDetails: EligibilityDetails,
  index = 0
): string | undefined {
  if (!eligibilityDetails.fileVerificationType || !eligibilityDetails.currentIdRequirementDetails) {
    return undefined;
  }

  const matchedGuidelines = eligibilityDetails.currentIdRequirementDetails.find((detail) => {
    if (typeof eligibilityDetails.fileVerificationType === 'string') {
      return detail.title === eligibilityDetails.fileVerificationType;
    }

    return detail.title === eligibilityDetails.fileVerificationType?.[index];
  })?.guidelines;
  if (matchedGuidelines === undefined) return undefined;

  return matchedGuidelines;
}

type VerificationMethodDetailsTagProps = Pick<TagProps, 'infoMessage'>;

const VerificationMethodDetailsTag: FC<VerificationMethodDetailsTagProps> = (props) => (
  <Tag {...props} state="Info" iconLeft={faCircleInfo} />
);
