export enum EventBridgePermissions {
  SEND_MESSAGE = 'sqs:SendMessage',
  DB_PUT = 'dynamodb:PutItem',
  DB_DELETE = 'dynamodb:DeleteItem',
  DB_QUERY = 'dynamodb:Query',
}
