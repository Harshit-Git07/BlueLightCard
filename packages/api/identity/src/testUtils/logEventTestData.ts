export function anAuthenticationLogEvent(
  memberId: string = '324325',
  timestamp: string = '2024-09-19T07:34:56.618Z',
  clientId: string = '5crqumaaogmdth5s6uh9r0orsv',
  action: string = 'TokenGeneration_Authentication',
) {
  return aLogEvent(
    memberId,
    timestamp,
    clientId,
    action,
    'identity-TokenGeneration_Authentication',
    '1-66c314cd-4fb88b2871d1b24a5d4cebd1',
  );
}

export function aHostedAuthLogEvent(
  memberId: string = '83139',
  timestamp: string = '2024-08-19T09:47:57.618Z',
  clientId: string = '69csn3p8t19rlacbu734slsqpk',
  action: string = 'identity-preTokenGeneration',
) {
  return aLogEvent(
    memberId,
    timestamp,
    clientId,
    action,
    'identity-preTokenGeneration',
    '1-66c30c71-2fbc70a910a744820e161127',
  );
}

export function aRefreshTokenLogEvent(
  memberId: string = '213434',
  timestamp: string = '2024-09-23T07:12:10.618Z',
  clientId: string = '69csn3p8t19rlacbu734slsqpk',
  action: string = 'TokenGeneration_RefreshTokens',
) {
  return aLogEvent(
    memberId,
    timestamp,
    clientId,
    action,
    'identity-RefreshTokens',
    '1-66c30c7f-3e0c774c74d17c892857cbb4',
  );
}

export function aLogEvent(
  memberId: string = '324325',
  timestamp: string = '2024-09-19T07:34:56.618Z',
  clientId: string = '5crqumaaogmdth5s6uh9r0orsv',
  action: string = 'TokenGeneration_Authentication',
  service: string = 'identity-TokenGeneration_Authentication',
  xray_trace_id: string = '1-66c314cd-4fb88b2871d1b24a5d4cebd1',
) {
  return {
    message: JSON.stringify({
      level: 'INFO',
      message: 'audit',
      service: service,
      timestamp: timestamp,
      xray_trace_id: xray_trace_id,
      audit: true,
      action: action,
      memberId: memberId,
      clientId: clientId,
    }),
  };
}
