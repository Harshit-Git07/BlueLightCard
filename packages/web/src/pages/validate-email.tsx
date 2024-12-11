import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BRAND, ButtonV2 as Button, ThemeVariant, Typography } from '@bluelightcard/shared-ui';
import { BRAND as brand } from '@/global-vars';
import withLayout from '../common/hoc/withLayout';
import useValidateEmailPost, { ValidateEmailRequest } from '../common/hooks/useValidateEmailPost';
import BlcSuccessful from '@assets/blc-successful.svg';
import BlcUnsuccessful from '@assets/blc-unsuccessful.svg';
import DdsSuccessful from '@assets/dds-successful.svg';
import DdsUnsuccessful from '@assets/dds-unsuccessful.svg';

const ValidateEmailPage: NextPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');
  const token = searchParams?.get('token');

  const [isValidated, setIsValidated] = useState<boolean>();

  const { isPending, mutate, isError } = useValidateEmailPost();

  const Picture = useMemo(() => {
    let result = undefined;

    switch (brand.toString()) {
      case BRAND.BLC_UK:
      case BRAND.BLC_AU:
        result = isError ? BlcUnsuccessful : BlcSuccessful;
        break;
      case BRAND.DDS_UK:
        result = isError ? DdsUnsuccessful : DdsSuccessful;
        break;
    }

    return result;
  }, [isError]);

  useEffect(() => {
    if (type && token) {
      const request: ValidateEmailRequest = {
        emailType: type,
        emailPayload: token,
      };

      mutate(request, {
        onSuccess: () => setIsValidated(true),
      });
    }
  }, [type, token, mutate]);

  if (isPending) {
    return null;
  }

  return (
    <div className="my-5 px-5 flex justify-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <Picture className="w-[300px] h-[300px]" />

        <Typography variant="title-medium-semibold">
          {isValidated ? 'Your email has been verified' : 'Your email couldn’t be verified'}
        </Typography>

        <div className="text-center">
          <Typography variant="body">
            {isValidated
              ? 'Use your new email to log in and continue enjoying thousands of discounts.'
              : 'Go back to the verification email in your inbox and click ‘Activate My Account’ to try again.'}
          </Typography>
        </div>

        {isValidated ? (
          <Button variant={ThemeVariant.Primary} type="button" size="Large">
            Log in
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default withLayout(ValidateEmailPage);
