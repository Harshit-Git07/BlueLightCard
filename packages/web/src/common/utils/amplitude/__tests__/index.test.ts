import * as amplitude from '@amplitude/analytics-browser';
import * as target from '../index';
import jwt_decode from 'jwt-decode';

const mockedUserId = '1234';

jest.mock('jwt-decode');
jest.mock('@amplitude/analytics-browser');
jest.mock('@/global-vars', () => ({
  AMPLITUDE_API_KEY: 'API_KEY',
}));

const jwtDecodeMock = jest.mocked(jwt_decode);
const amplitudeMock = jest.mocked(amplitude);

describe('Initialise Amplitude', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('When an "idToken" exists in local storage', () => {
    beforeEach(() => {
      localStorage.setItem('idToken', 'validIdToken');
      jwtDecodeMock.mockReturnValue({ 'custom:blc_old_uuid': mockedUserId } as any);
      amplitudeMock.init.mockReturnValue({ promise: Promise.resolve() });
      amplitudeMock.setSessionId.mockReturnValue();
    });

    it('should initialise amplitude if "idToken" exists', () => {
      target.initialiseAmplitude();

      expect(amplitudeMock.init).toHaveBeenCalledWith('API_KEY', mockedUserId, {
        serverZone: 'EU',
        logLevel: amplitude.Types.LogLevel.Warn,
      });
    });

    it('should call set session id with the session id', async () => {
      sessionStorage.setItem('amplitude_session_id', '5678');

      await target.initialiseAmplitude();

      expect(amplitudeMock.setSessionId).toHaveBeenCalledWith(5678);
    });
  });
});
