import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { z } from 'zod';

const headersSchema = z.object({
  Authorization: z.string(),
  ['x-client-type']: z.enum(['web', 'mobile']),
});

export const extractHeaders = (headers: APIGatewayProxyEventHeaders) => {
  const headerValidation = headersSchema.safeParse(headers);
  if (!headerValidation.success) {
    throw new Error(
      `Invalid headers: ${headerValidation.error.issues.map((issue) => issue.path + ' - ' + issue.message).join(', ')}`,
    );
  }

  const authToken = headerValidation.data.Authorization;
  const platform = headerValidation.data['x-client-type'];

  return { authToken, platform };
};
