import { LoginAudit } from 'src/models/loginAudits';
import { calculateLoginState } from '../loginStateCalculator';

const originalEnv = process.env;

const clientId = '5rm352n1dggfdbs7b7ef2bsmj9';

describe('calculateLoginState', () => {
  afterEach(() => {
    process.env = originalEnv;
  });

  test('should return WEB_LOGIN when action is TokenGeneration_Authentication and clientId is webClientId', () => {
    process.env = {
      WEB_CLIENT_ID: clientId,
      LOGIN_CLIENT_IDS: '{"1":"hello","2":"hello","3":"hello"}',
    };

    const action = 'TokenGeneration_Authentication';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_LOGIN);
  });

  test('should return APP_LOGIN when action is TokenGeneration_Authentication and clientId is not webClientId', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: '{"1":"hello","2":"hello","3":"hello"}',
    };

    const action = 'TokenGeneration_Authentication';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.APP_LOGIN);
  });

  test('should return WEB_HOSTEDUI_LOGIN when action is TokenGeneration_HostedAuth and clientId is not in CLIENT_NAME_LOGIN_AUDIT_MAP', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{}`,
    };

    const action = 'TokenGeneration_HostedAuth';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_HOSTEDUI_LOGIN);
  });

  test('should return WEB_LOGIN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_HostedAuth and clientId maps to WEB', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"WEB"}`,
    };

    const action = 'TokenGeneration_HostedAuth';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_LOGIN);
  });

  test('should return APP_LOGIN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_HostedAuth and clientId maps to APP', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"APP"}`,
    };

    const action = 'TokenGeneration_HostedAuth';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.APP_LOGIN);
  });

  test('should return WEB_REFRESH_TOKEN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_RefreshTokens and clientId maps to WEB', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"WEB"}`,
    };

    const action = 'TokenGeneration_RefreshTokens';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_REFRESH_TOKEN);
  });

  test('should return APP_REFRESH_TOKEN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_RefreshTokens and clientId maps to APP', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"APP"}`,
    };

    const action = 'TokenGeneration_RefreshTokens';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.APP_REFRESH_TOKEN);
  });

  test('should return WEB_REFRESH_TOKEN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_RefreshTokens and clientId maps to WEB_HOSTEDUI', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"WEB_HOSTEDUI"}`,
    };

    const action = 'TokenGeneration_RefreshTokens';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_REFRESH_TOKEN);
  });

  test('should return APP_REFRESH_TOKEN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_RefreshTokens and clientId maps to APP_HOSTEDUI', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"APP_HOSTEDUI"}`,
    };

    const action = 'TokenGeneration_RefreshTokens';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.APP_REFRESH_TOKEN);
  });

  test('should return WEB_REFRESH_TOKEN from CLIENT_NAME_LOGIN_AUDIT_MAP when action is TokenGeneration_RefreshTokens and clientId is not in CLIENT_NAME_LOGIN_AUDIT_MAP', () => {
    process.env = {
      WEB_CLIENT_ID: 'webClientId',
      LOGIN_CLIENT_IDS: `{"${clientId}":"WEB_HOSTEDUI"}`,
    };

    const action = 'TokenGeneration_RefreshTokens';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(LoginAudit.WEB_REFRESH_TOKEN);
  });

  test('should return 0 when action is not known', () => {
    const action = 'UnknownAction';

    const result = calculateLoginState(clientId, action);

    expect(result).toEqual(0);
  });
});
