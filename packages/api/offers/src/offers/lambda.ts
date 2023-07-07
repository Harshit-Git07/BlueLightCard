import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'

import { UserModel, User } from 'src/models/user';


const service: string = process.env.service as string;

const logger = new Logger({ serviceName: `${service}-user-crud` });

let users: User[] = [{ id: '1', name: 'John Does', email: 'john@example.com', age: 30 }];

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('input', { event });

  if (!event.pathParameters || !event.pathParameters.id) {
    logger.info('Missing user id');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing user id' }),
    };
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    logger.info('User id must be a number', { userId });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User id must be a number' }),
    };
  }

  const user: User | undefined = users.find((u) => u.id === userId);

  return {
    statusCode: user ? 200 : 404,
    body: JSON.stringify(user || { message: 'User not found' }),
  };
};

export const post = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing user data' }),
    };
  }

  const newUser = JSON.parse(event.body);
  const result = UserModel.safeParse(newUser);

  if (!result.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid user data', errors: result.error.issues }),
    };
  }

  users.push(result.data);

  return {
    statusCode: 201,
    body: JSON.stringify(result.data),
  };
};

export const put = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing user id' }),
    };
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User id must be a number' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing user data' }),
    };
  }

  const updatedUser = JSON.parse(event.body);
  const result = UserModel.safeParse(updatedUser);

  if (!result.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid user data', errors: result.error }),
    };
  }

  const index: number = users.findIndex((user) => user.id === userId);

  if (index != -1) {
    users[index] = result.data;
  }

  return {
    statusCode: index !== -1 ? 200 : 404,
    body: JSON.stringify(index !== -1 ? result.data : { message: 'User not found' }),
  };
};

export const remove = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing user id' }),
    };
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User id must be a number' }),
    };
  }

  const index: number = users.findIndex((user) => user.id === userId);

  if (index != -1) {
    users.splice(index, 1);
  }

  return {
    statusCode: index !== -1 ? 200 : 404,
    body: JSON.stringify({ message: index !== -1 ? 'User Deleted' : 'User not found' }),
  };
};
