export interface auth0LinkReturn {
  memberId: string;
  url: string;
}

export interface emailTemplates {
  [key: string]: Record<string, string>;
}
