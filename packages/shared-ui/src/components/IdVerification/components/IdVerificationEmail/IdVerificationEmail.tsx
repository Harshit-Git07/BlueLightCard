import { ChangeEvent, FC, SyntheticEvent, useEffect, useRef, useState } from 'react';
import AccountDrawer from '../../../AccountDrawer';
import { colours, fonts } from '../../../../tailwind/theme';
import ListSelector from '../../../ListSelector';
import { ListSelectorState } from '../../../ListSelector/types';
import TextInput from '../../../TextInput';
import { z } from 'zod';
import useIdVerificationEmailPut from './useIdVerificationEmailPut';
import useStateSync from '../../../../hooks/useStateSync';
import useIdVerification from '../../useIdVerification';
import IdVerificationTitle from '../IdVerificationTitle';
import { verificationMethods } from '../../IdVerificationConfig';
import { IdVerificationMethod } from '../../IdVerificationTypes';

const validation = z.string().email();
const IdVerificationEmail: FC = () => {
  const { resetVerification, title } = useIdVerification();
  const [email, setEmail] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countDown, setCountDown, getCountDown] = useStateSync<number>(0);
  const { mutateAsync, isPending } = useIdVerificationEmailPut();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = undefined;
  };

  useEffect(() => {
    return stopInterval;
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e?: SyntheticEvent) => {
    e?.preventDefault();
    if (!isValid || isPending) return;

    setShowConfirmation(false);
    const { status } = await mutateAsync({ email });

    if (status < 300) {
      setShowConfirmation(true);
      setCountDown(30);
      intervalRef.current = setInterval(() => {
        const newCountDown = getCountDown() - 1;
        if (newCountDown === 0) stopInterval();
        setCountDown(newCountDown);
      }, 1000);
    }
  };

  const validationResult = validation.safeParse(email);
  const { success: isValid } = validationResult;
  const error = !validationResult.success ? validationResult.error : null;
  const { _errors: errors = [] } = error ? error.format() : {};

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
      <AccountDrawer
        title={title}
        primaryButtonLabel={countDown > 0 ? `Resend email in ${countDown}s` : 'Verify email'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Back'}
        secondaryButtonOnClick={resetVerification}
        isDisabled={!isValid || isPending || countDown > 0}
      >
        <IdVerificationTitle>Choose verification method</IdVerificationTitle>

        <div className={'flex flex-col gap-3'}>
          <ListSelector
            title={'Work Email'}
            description={verificationMethods[IdVerificationMethod.WORK_EMAIL].description}
            state={ListSelectorState.Selected}
            onClick={resetVerification}
            className={'sm:!min-w-full'}
          />
          <TextInput
            id={'email'}
            placeholder={'Enter work email address'}
            value={email}
            onChange={onChange}
            isValid={isValid || !email}
            message={email && errors.length ? errors.join('. ') : ''}
          />
          {showConfirmation ? (
            <>
              <p className={`${fonts.body} ${colours.textOnSurface}`}>
                We’ve sent an email to <span className={fonts.bodySemiBold}>{email}</span> with a
                link to confirm your eligibility.
              </p>
              <p className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>
                Didn’t get an email? Please check your junk folder or resend it.
              </p>
            </>
          ) : null}
        </div>
      </AccountDrawer>
    </form>
  );
};

export default IdVerificationEmail;
