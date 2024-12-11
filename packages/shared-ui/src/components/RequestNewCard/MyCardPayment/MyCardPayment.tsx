import { FC, useState } from 'react';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { AccountDrawer, BRAND, colours, fonts, useDrawer } from '../../../index';
import MyCardStripePayment from './MyCardStripePayment';
import { BRAND as envBrand } from '../../../global-vars';
import useRequestNewCard from '../useRequestNewCard';

const redirectUrl = '';

// put it all in the account drawer
const MyCardPayment: FC = () => {
  const { close } = useDrawer();
  const { isPending, goNext } = useRequestNewCard();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [stripe, setStripe] = useState<Stripe>();
  const [elements, setElements] = useState<StripeElements>();
  const [stripeFormFilled, setStripeFormFilled] = useState(false);

  const handleStripeFormLoaded = (stripe: Stripe, elements: StripeElements) => {
    setStripe(stripe);
    setElements(elements);
  };

  const handleStripeFormChange = (isFilled: boolean) => {
    setStripeFormFilled(isFilled);
  };

  const handleStripePayIntent = async () => {
    if (!stripe || !elements || isPending) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
      redirect: 'if_required',
    });

    const errorMessage = result.error?.message;
    if (result.error) {
      setErrorMessage(errorMessage);
    }
    goNext();
  };

  const years = envBrand === BRAND.DDS_UK ? 5 : 2;
  const currencySymbol = envBrand === BRAND.BLC_AU ? '$' : '£';

  return (
    <form className="h-full" onSubmit={handleStripePayIntent}>
      <AccountDrawer
        primaryButtonLabel={'Pay and submit'}
        primaryButtonOnClick={handleStripePayIntent}
        secondaryButtonLabel={'Cancel'}
        secondaryButtonOnClick={close}
        title={'Request a new Card'}
        isDisabled={!stripeFormFilled || isPending}
      >
        {errorMessage && <p className={`${colours.textError} mt-[6px]`}>{errorMessage}</p>}

        <div className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>
          Reprint your card for {currencySymbol}4.99, valid for the next {years} years.
        </div>

        <MyCardStripePayment
          onFormLoaded={handleStripeFormLoaded}
          onFormChange={handleStripeFormChange}
        />
      </AccountDrawer>
    </form>
  );
};

export default MyCardPayment;
