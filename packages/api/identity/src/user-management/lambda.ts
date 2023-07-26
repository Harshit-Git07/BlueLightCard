import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { UserModel, User } from 'src/models/user';
import { Response } from '../../../core/src/utils/restResponse/response';

const service: string = process.env.service as string;

const logger = new Logger({ serviceName: `${service}-user-crud` });

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('input', { event });

  let users: User[] = [{ id: '1', name: 'John Does', email: 'john@example.com', age: 30 }];

  if (!event.pathParameters || !event.pathParameters.id) {
    logger.info('Missing user id');

    return Response.BadRequest({ message: 'Missing user id' });
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    logger.info('User id must be a number', { userId });
    return Response.BadRequest({ message: 'User id must be a number' });
  }

  const user: User | undefined = users.find((u) => u.id === userId);

  return user ? Response.OK({ message: 'User Found', data: user }) : Response.BadRequest({ message: 'User not found' });
};

export const post = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  let users: User[] = [{ id: '1', name: 'John Does', email: 'john@example.com', age: 30 }];

  if (!event.body) {
    return Response.BadRequest({ message: 'Missing user data' });
  }

  const newUser = JSON.parse(event.body);
  const result = UserModel.safeParse(newUser);

  if (!result.success) {
    return Response.BadRequest({ message: 'Invalid user data', error: result.error.issues });
  }

  users.push(result.data);

  return Response.Created({ message: 'Created', data: result.data });
};

export const put = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  let users: User[] = [{ id: '1', name: 'John Does', email: 'john@example.com', age: 30 }];

  if (!event.pathParameters || !event.pathParameters.id) {
    return Response.BadRequest({ message: 'Missing user id' });
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    return Response.BadRequest({ message: 'User id must be a number' });
  }

  if (!event.body) {
    return Response.BadRequest({ message: 'Missing user data' });
  }

  const updatedUser = JSON.parse(event.body);
  const result = UserModel.safeParse(updatedUser);

  if (!result.success) {
    return Response.BadRequest({ message: 'Invalid user data', error: result.error.issues });
  }

  const index: number = users.findIndex((user) => user.id === userId);

  if (index != -1) {
    users[index] = result.data;
  }

  return index !== -1
    ? Response.OK({ message: 'User updated', data: result.data })
    : Response.BadRequest({ message: 'User not found' });
};

export const remove = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  let users: User[] = [{ id: '1', name: 'John Does', email: 'john@example.com', age: 30 }];

  if (!event.pathParameters || !event.pathParameters.id) {
    return Response.BadRequest({ message: 'Missing user id' });
  }

  const userId = event.pathParameters.id;

  if (isNaN(Number(userId))) {
    return Response.BadRequest({ message: 'User id must be a number' });
  }

  const index: number = users.findIndex((user) => user.id === userId);

  if (index != -1) {
    users.splice(index, 1);
  }

  return index !== -1 ? Response.OK({ message: 'User deleted' }) : Response.BadRequest({ message: 'User not found' });
};
