export function isDev(stage: string) : boolean {
  return stage !== 'production' && stage !== 'staging';
}
  
export function isProduction(stage: string) : boolean{
  return stage === 'production';
}
  
export function isStaging(stage: string) : boolean{
  return stage === 'staging';
}