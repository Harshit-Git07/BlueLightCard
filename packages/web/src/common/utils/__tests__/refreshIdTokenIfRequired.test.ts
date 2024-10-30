import { refreshIdTokenIfRequired } from '@/utils/refreshIdTokenIfRequired';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import AuthTokensService from '@/root/src/common/services/authTokensService';
import { JWT, unpackJWT } from '@core/utils/unpackJWT';

const idToken = 'id-token';
const refreshedIdToken = 'refreshed-id-token';
const refreshToken = 'refresh-token';
const username = 'username';

jest.mock('@/root/src/common/services/authTokensService');
jest.mock('@/utils/reAuthFromRefreshToken');
jest.mock('../../../../../api/core/src/utils/unpackJWT');

const reAuthFromRefreshTokenMock = jest.mocked(reAuthFromRefreshToken);
const mockedUnpackJWT = jest.mocked(unpackJWT);
const mockedSetTokens = jest.mocked(AuthTokensService.setTokens);

jest.useFakeTimers({ now: new Date('2023-01-11T09:15:18.000Z') });

describe('refreshIdTokenIfRequired', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AuthTokensService.getRefreshToken = jest.fn().mockReturnValue(refreshToken);
    AuthTokensService.getUsername = jest.fn().mockReturnValue(username);
  });

  it('should not refresh idToken if token has not expired', async () => {
    AuthTokensService.getIdToken = jest.fn().mockReturnValue(idToken);
    mockedUnpackJWT.mockReturnValue({ exp: 1773428519, sub: username } as JWT);

    const result = await refreshIdTokenIfRequired();

    expect(result).toBe(idToken);
    expect(reAuthFromRefreshToken).not.toHaveBeenCalled();
    expect(AuthTokensService.getIdToken).toHaveBeenCalledTimes(1);
  });

  it('should refresh idToken if token has expired', async () => {
    AuthTokensService.getIdToken = jest
      .fn()
      .mockReturnValueOnce(idToken)
      .mockReturnValueOnce(refreshedIdToken);
    reAuthFromRefreshTokenMock.mockResolvedValue(true);
    mockedUnpackJWT.mockReturnValue({ exp: 1573428519, sub: username } as JWT);

    const result = await refreshIdTokenIfRequired();

    expect(result).toBe(refreshedIdToken);
    expect(reAuthFromRefreshTokenMock).toHaveBeenCalledWith(
      username,
      refreshToken,
      mockedSetTokens
    );
    expect(AuthTokensService.getIdToken).toHaveBeenCalledTimes(2);
  });

  it('should return the existing id token if the refresh fails', async () => {
    AuthTokensService.getIdToken = jest.fn().mockReturnValueOnce(idToken);
    reAuthFromRefreshTokenMock.mockResolvedValue(false);
    mockedUnpackJWT.mockReturnValue({ exp: 1573428519, sub: username } as JWT);

    const result = await refreshIdTokenIfRequired();

    expect(result).toBe(idToken);
    expect(reAuthFromRefreshTokenMock).toHaveBeenCalledWith(
      username,
      refreshToken,
      mockedSetTokens
    );
    expect(AuthTokensService.getIdToken).toHaveBeenCalledTimes(1);
  });

  it('should return the existing id token if the JWT unpacking throws an error ', async () => {
    mockedUnpackJWT.mockImplementation(() => {
      throw new Error('Failed to unpack JWT');
    });
    AuthTokensService.getIdToken = jest.fn().mockReturnValueOnce(idToken);

    const result = await refreshIdTokenIfRequired();

    expect(result).toBe(idToken);
    expect(reAuthFromRefreshTokenMock).not.toHaveBeenCalled();
    expect(AuthTokensService.getIdToken).toHaveBeenCalledTimes(1);
  });
});
