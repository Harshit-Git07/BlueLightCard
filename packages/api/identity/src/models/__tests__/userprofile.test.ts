import { describe, expect, test } from '@jest/globals';
import { UserProfileModel } from '../userprofile';

describe('User Profile Model Tests', () => {
  test('Validate event with undefined values in zod schema model', async () => {
    const json = { merged_uid: null, spare_email_validated: undefined, email: "test@gmail.com"}
    const detail = UserProfileModel.parse(json);
    expect(detail).toEqual({"merged_uid": null, "spare_email_validated": undefined, email: "test@gmail.com"});
  });

  test('Validate event with string values are being converted to a number by Zod schema model', async () => {
    const json = { merged_uid: '1234', spare_email_validated: '1', email: "test@gmail.com"}
    const detail = UserProfileModel.parse(json);
    expect(detail).toEqual({"merged_uid": 1234, "spare_email_validated": 1, email: "test@gmail.com"});
  });

  test('Validate empty event value is being accepted by Zod schema model', async () => {
    const json = {}
    const detail = UserProfileModel.parse(json);
    expect(detail).toEqual({});
  });
});
