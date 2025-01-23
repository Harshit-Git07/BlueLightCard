import { FC, FormEventHandler } from 'react';
import { copy } from './copy';
import { ThemeVariant } from '../../types';
import { PersonalInfoFormState, usePersonalInfoState } from './hooks/usePersonalInfoState';
import { Toast, useCSSConditional, usePlatformAdapter } from '../..';
import { genderDropdownOptions, renderGenderValue } from './constants';
import { NameSection } from './components/NameSection';
import { EmailPasswordSection } from './components/EmailPasswordSection';
import { EmploymentSection } from './components/EmploymentSection';
import Button from '../Button-V2';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import FieldLabel from '../FieldLabel';
import useMemberId from '../../hooks/useMemberId';
import { ProfileSchema } from '../CardVerificationAlerts/types';
import useMemberProfileGet from '../../hooks/useMemberProfileGet';
import { PhoneNumberRegionSection } from './components/PhoneNumberRegionSection';
import Dropdown from '../MyAccountDuplicatedComponents/Dropdown';
import { DropdownOption } from '../MyAccountDuplicatedComponents/Dropdown/types';
import DatePicker from '../MyAccountDuplicatedComponents/DatePicker';
import useToaster from '../Toast/Toaster/useToaster';
import { ToastPosition, ToastStatus } from '../Toast/ToastTypes';

const PersonalInformation: FC = () => {
  const memberId = useMemberId();
  const { isLoading } = useMemberProfileGet(memberId);
  const { formState, saveButtonDisabled, updateFormValue, makeApiRequest } = usePersonalInfoState();
  const { openToast } = useToaster();

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const response = await makeApiRequest();
    if (!response) return;

    if (response.type === 'success') {
      handleSuccess();
    } else {
      handleError();
    }
  };

  const handleSuccess = () => {
    openToast(
      <Toast
        status={ToastStatus.Success}
        title={copy.api.updateSuccess.title}
        text={copy.api.updateSuccess.subtitle}
      />,
      {
        position: ToastPosition.TopRight,
      },
    );
  };

  const handleError = () => {
    openToast(
      <Toast
        status={ToastStatus.Error}
        title={copy.api.updateError.title}
        text={copy.api.updateError.subtitle}
      />,
      {
        position: ToastPosition.TopRight,
      },
    );
  };

  const onDateChange = (newDate?: Date) => updateFormValue('dateOfBirth', newDate);
  const onPhoneNumberChange = async (phoneNumber: string) =>
    updateFormValue('phoneNumber', phoneNumber);
  const onGenderChange = (gender: DropdownOption) =>
    updateFormValue('gender', gender.id as ProfileSchema['gender']);
  const onCountyChange = (county: DropdownOption) => updateFormValue('region', county.label);
  const onDivisionChange = (division: DropdownOption) => updateFormValue('divisionId', division.id);

  const loadingStyles = 'blur-[2px]';
  const formStyles = useCSSConditional({
    'flex flex-col gap-[32px]': true,
    [loadingStyles]: isLoading,
  });
  const buttonStyles = `min-[821px]:w-fit min-[821px]:self-end`;

  return (
    <form className={formStyles} name="PersonalDetails" onSubmit={onFormSubmit}>
      <FormFieldSet
        dateOfBirth={formState.dateOfBirth}
        onDateChange={onDateChange}
        gender={formState.gender}
        onGenderChange={onGenderChange}
        phoneNumber={formState.phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        region={formState.region}
        onCountyChange={onCountyChange}
        divisionId={formState.divisionId}
        onDivisionChange={onDivisionChange}
      />
      <Button size="Large" disabled={saveButtonDisabled} className={buttonStyles} type="submit">
        {copy.saveButtonText}
      </Button>
    </form>
  );
};

type FormFieldSetProps = {
  dateOfBirth: PersonalInfoFormState['dateOfBirth'];
  onDateChange: (date?: Date) => void;
  gender: PersonalInfoFormState['gender'];
  onGenderChange: (gender: DropdownOption) => void;
  phoneNumber: PersonalInfoFormState['phoneNumber'];
  onPhoneNumberChange: (phoneNumber: string) => void;
  region: PersonalInfoFormState['region'];
  onCountyChange: (county: DropdownOption) => void;
  divisionId: PersonalInfoFormState['divisionId'];
  onDivisionChange: (division: DropdownOption) => void;
};

export const FormFieldSet: FC<FormFieldSetProps> = ({
  dateOfBirth,
  onDateChange,
  gender,
  onGenderChange,
  phoneNumber,
  onPhoneNumberChange,
  region,
  onCountyChange,
  divisionId,
  onDivisionChange,
}) => {
  const { platform, navigate } = usePlatformAdapter();

  const mobileRowStyles = (compact: boolean) => `flex flex-col ${compact ? 'gap-3' : 'gap-[24px]'}`;
  const laptopRowStyles = `min-[821px]:grid min-[821px]:grid-cols-2 min-[821px]:auto-rows-auto min-[821px]:gap-x-[12px] min-[821px]:gap-y-[8px]`;
  const rowStyles = (compact: boolean) => `${mobileRowStyles(compact)} ${laptopRowStyles} *:w-full`;

  return (
    <div className={'flex flex-col gap-[24px]'}>
      <div className={rowStyles(true)}>
        <NameSection />
      </div>
      <div className={rowStyles(false)}>
        <DatePicker
          value={dateOfBirth.value}
          onChange={onDateChange}
          label={copy.dateOfBirthLabel}
          isDisabled={dateOfBirth.disabled}
          isValid={!dateOfBirth.error}
          validationMessage={dateOfBirth.error}
        />
        <Dropdown
          options={genderDropdownOptions}
          value={renderGenderValue(gender.value)}
          onChange={onGenderChange}
          isDisabled={gender.disabled}
          label={copy.gender.label}
          placeholder={copy.gender.placeholder}
        />
      </div>
      <div className={rowStyles(false)}>
        <EmailPasswordSection />
      </div>
      {platform === 'mobile-hybrid' ? (
        <div>
          <FieldLabel label={copy.biometrics.label} htmlFor={'idk'} />
          <Button
            className={'!justify-start w-fit !px-0'}
            variant={ThemeVariant.Tertiary}
            size="Small"
            iconRight={faArrowUpRightFromSquare}
            onClick={() => navigate('/biometric')}
          >
            {copy.biometrics.buttonText}
          </Button>
        </div>
      ) : null}
      <div className={rowStyles(false)}>
        <PhoneNumberRegionSection
          phoneNumber={phoneNumber}
          onPhoneNumberChange={onPhoneNumberChange}
          region={region}
          onRegionChange={onCountyChange}
        />
      </div>
      <div className={rowStyles(false)}>
        <EmploymentSection divisionId={divisionId} onDivisionChange={onDivisionChange} />
      </div>
    </div>
  );
};

export default PersonalInformation;
