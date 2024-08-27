import { LoginAudit, CLIENT_NAME_LOGIN_AUDIT_MAP } from 'src/models/loginAudits';

export function calculateLoginState(clientId: string, action: string): number {
  const webClientId = process.env.WEB_CLIENT_ID;
  const loginClientIds = process.env.LOGIN_CLIENT_IDS ?? '{}';
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
