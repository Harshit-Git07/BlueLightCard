export const BadRequestModelSchema = {
    properties: {
      message: {
        type: 'string',
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
            },
            expected: {
              type: 'string',
            },
            received: {
              type: 'string',
            },
            path: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            message: {
              type: 'string',
            },
          },
          required: ['code', 'expected', 'received', 'path', 'message'],
        },
      },
    },
    required: ['message'],
  };