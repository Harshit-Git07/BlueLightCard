import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { LoginAudit, CLIENT_NAME_LOGIN_AUDIT_MAP } from 'src/models/loginAudits';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

export function calculateLoginState(clientId: string, action: string): number {
  const webClientId = getEnv(IdentityStackEnvironmentKeys.WEB_CLIENT_ID);
  const loginClientIds = getEnvOrDefault(IdentityStackEnvironmentKeys.LOGIN_CLIENT_IDS, '{}');
  const loginClientIdMap = JSON.parse(loginClientIds);

  let state = 0;
  const loginClientKey = loginClientIdMap[clientId];

  if (action === 'TokenGeneration_Authentication') {
    state = clientId == webClientId ? LoginAudit.WEB_LOGIN : LoginAudit.APP_LOGIN;
  } else if (action === 'TokenGeneration_HostedAuth') {
    state = CLIENT_NAME_LOGIN_AUDIT_MAP[`${loginClientKey}_LOGIN`] ?? LoginAudit.WEB_HOSTEDUI_LOGIN;
  } else if (action === 'TokenGeneration_RefreshTokens') {
    state =
      CLIENT_NAME_LOGIN_AUDIT_MAP[`${loginClientKey}_REFRESH_TOKEN`] ??
      LoginAudit.WEB_REFRESH_TOKEN;
  }

  return state;
}
