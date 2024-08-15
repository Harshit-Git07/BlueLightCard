const EPHEMERAL_REGEX = /^pr-\d+-blc-mono(-dds)?$/;

export function isDev(stage: string): boolean {
  return !isProduction(stage) && !isStaging(stage);
}

export function isProduction(stage: string): boolean {
  return stage === 'production' || stage === 'production-dds';
}

export function isStaging(stage: string): boolean {
  return stage === 'staging' || stage === 'staging-dds';
}

export function isEphemeral(stage: string): boolean {
  return EPHEMERAL_REGEX.test(stage);
}

export function isLocal(stage: string): boolean {
  return !isProduction(stage) && !isStaging(stage) && !isEphemeral(stage);
}
