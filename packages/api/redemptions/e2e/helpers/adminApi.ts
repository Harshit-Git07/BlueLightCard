import AWS from 'aws-sdk';

export const getApiKey = (key: string): Promise<string> => {
  const APIGateway = new AWS.APIGateway();
  return new Promise((resolve) => {
    APIGateway.getApiKeys({ nameQuery: key, includeValues: true }, (_err, data) => {
      if (!data?.items?.[0].value) {
        throw new Error('Unable to find API key: ' + key);
      }

      resolve(data.items[0].value);
    });
  });
};
