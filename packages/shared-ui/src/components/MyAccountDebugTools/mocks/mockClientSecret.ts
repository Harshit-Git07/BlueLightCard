import { sleep } from '../../../utils/sleep';

export const mockClientSecret = async () => {
  await sleep(500);
  const clientSecret = 'pi_3QP5FUS9N5NHrlGY0bQa80cr_secret_eU2OXFoXnYqzCyw7JyJFB5Okt';
  return {
    status: 200,
    data: { data: { clientSecret } },
  };
};
