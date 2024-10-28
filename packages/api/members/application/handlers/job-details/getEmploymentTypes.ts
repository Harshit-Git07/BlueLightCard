import { APIGatewayProxyHandler } from 'aws-lambda';
// import { DynamoDB } from 'aws-sdk';
// import { Table } from 'sst/node/table';

// const dynamoDB = new DynamoDB.DocumentClient();
// const tableName = Table.referenceData.tableName;

export const handler: APIGatewayProxyHandler = async (event) => {
  const brand = event.pathParameters?.brand;

  if (!brand) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Brand parameter is required' }),
    };
  }

  try {
    // TODO: Implement actual query to 'blc-mono-referenceData' table
    const employmentTypes = ['Employed', 'Retired', 'Volunteer'];

    return {
      statusCode: 200,
      body: JSON.stringify(employmentTypes),
    };
  } catch (error) {
    console.error('Error retrieving employment types:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
