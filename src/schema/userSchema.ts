export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  example: {
    id: 1,
    username: 'helloWorld',
  },
};
