// Placeholder for when params are finalised
export interface EmailChangeRequestParams {
  subject: string;
}

export function emailChangeRequestBody(params: EmailChangeRequestParams): string {
  // TODO: This needs to use the actual email, the original ticket is marked as done but isn't complete https://bluelightcard.atlassian.net/browse/MM-361
  return `
    <html lang="en">
      <head>
        <title>${params.subject}</title>
      </head>
      
      <body>
        <h1>${params.subject}</h1>
      </body>

      Follow this link to change email: <a href="http://localhost:3000/callbackurl">http://localhost:3000/callbackurl</a>
    </html>
  `;
}
