export const SAMPLE_DOC = {
  swagger: '2.0',
  info: {
    title: 'Sample',
    description: 'Check this cool request before you decide what backend you will use.',
    version: '1.0',
  },
  produces: ['application/json'],
  tags: [
    {
      name: 'Public',
      description: 'just a simple "echo" from the server side.',
    },
    {
      name: 'Auth',
      description: 'Identify yourself in backend.',
    },
    {
      name: 'CRUD',
      description: '',
    },
  ],
  host: '',
  basePath: '/sample',
  paths: {
    '/': {
      get: {
        tags: ['Public'],
        description: 'Just a simple Hello.',
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        description: 'Login with a user (florin@doitdev.ro ) and pass (flo)',
        consumes: ['application/json'],
        produces: ['application/json'],
        required: true,
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Payload for login',
            required: true,
            schema: {
              $ref: '#/definitions/login',
            },
          },
        ],
        responses: {
          '400': {
            description: 'Invalid input',
          },
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/getUser': {
      get: {
        tags: ['Auth'],
        description: 'Get user info',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/createDb': {
      get: {
        tags: ['CRUD'],
        description: 'Create a simple database for play.',
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/insert': {
      post: {
        tags: ['CRUD'],
        description: 'Add a simple row in database',
        consumes: ['application/json'],
        produces: ['application/json'],
        required: true,
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
          {
            in: 'body',
            name: 'body',
            description: 'Payload for insert',
            required: true,
            schema: {
              $ref: '#/definitions/sample',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/getAll': {
      get: {
        tags: ['CRUD'],
        description: 'Get all data from table',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/getOne/{id}': {
      get: {
        tags: ['CRUD'],
        description: 'Get one row from table',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'number',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/update/{id}': {
      put: {
        tags: ['CRUD'],
        description: 'Update one row from table',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'number',
          },
          {
            in: 'body',
            name: 'body',
            description: 'Payload for update',
            required: true,
            schema: {
              $ref: '#/definitions/sample',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/delete/{id}': {
      delete: {
        tags: ['CRUD'],
        description: 'Delete row by Id',
        parameters: [
          {
            in: 'header',
            name: 'dvqsyj30zb',
            description: 'Header token check',
            value:
              'U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K',
            required: true,
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'number',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
  definitions: {
    login: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          value: 'florin@doitdev.ro',
        },
        password: {
          type: 'string',
          value: 'flo',
        },
      },
    },
    sample: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  },
}
