// Placeholder for when params are finalised
export type EmailChangeRequestParams = {
  subject: string;
};

export const emailChangeRequestBody = (params: EmailChangeRequestParams): string => {
  const emailChangeLine =
    'Follow this link to change email: <a href="http://localhost:3000/callbackurl">http://localhost:3000/callbackurl</a>';
  return `<html><head><title>${params.subject}</title></head><body><h1>${params.subject}</h1></body>${emailChangeLine}</html>`;
};
