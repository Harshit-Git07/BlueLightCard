const EPHEMERAL_REGEX = /^pr-\d+-blc-mono$/;

export function isDev(stage: string): boolean {
  return stage !== 'production' && stage !== 'staging';
}

export function isProduction(stage: string): boolean {
  return stage === 'production';
}

export function isStaging(stage: string): boolean {
  return stage === 'staging';
}

export function isEphemeral(stage: string): boolean {
  return EPHEMERAL_REGEX.test(stage);
}

export function isLocal(stage: string): boolean {
  return !isProduction(stage) && !isStaging(stage) && !isEphemeral(stage);
}
