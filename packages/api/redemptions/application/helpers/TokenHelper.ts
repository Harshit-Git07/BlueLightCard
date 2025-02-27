import z from 'zod';

import { JsonObject } from '@blc-mono/core/types/json';
import { Result } from '@blc-mono/core/types/result';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';

const BEARER_PREFIX = 'Bearer ';

const tokenPayloadSchema = z
  .object({
    'custom:blc_old_id': z.string(),
    'custom:blc_old_uuid': z.string(),
    card_status: z.string(),
  })
  .nonstrict();

type TokenPayload = z.infer<typeof tokenPayloadSchema>;

export class TokenHelper {
  /**
   * Returns the token without the Bearer prefix
   */
  static removeBearerPrefix(authorizationHeader: string): string {
    if (authorizationHeader.startsWith(BEARER_PREFIX)) {
      return authorizationHeader.substring(BEARER_PREFIX.length);
    } else {
      // If no Bearer prefix, assume the full header is the token
      return authorizationHeader;
    }
  }

  static extractDataFromToken(token: string): Result<TokenPayload, unknown> {
    try {
      const decodedToken = unpackJWT(token);

      const parsedToken = tokenPayloadSchema.parse(decodedToken);
      return Result.ok(parsedToken);
    } catch (err) {
      return Result.err(err);
    }
  }

  /**
   * Extracts the data from the token without any validation
   *
   * **SAFETY**
   *
   * This method does not validate the token. It should only be used in contexts
   * where the token is already known to be valid, or where the token does not
   * need to be validated.
   *
   * Additionally, this method type casts the resulting data to a JSON value
   * type. It should therefore only be used when the token is known to encode
   * JSON data.
   */
  static unsafeExtractDataFromToken(token: string): Result<JsonObject, unknown> {
    try {
      // SAFETY: this assumes the return value of `jwtDecode` will be a JsonObject
      return Result.ok(unpackJWT(token));
    } catch (err) {
      return Result.err(err);
    }
  }
}
