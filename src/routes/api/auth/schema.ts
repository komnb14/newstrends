import { FastifySchema } from 'fastify';
import { createAppErrorSchema } from '../../../lib/AppError.js';
import { userSchema } from '../../../schema/userSchema.js';

const authResultSchema = {
  type: 'object',
  properties: {
    tokens: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: userSchema,
  },
};

const authBodySchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

export const registerSchema: FastifySchema = {
  body: authBodySchema,
  response: {
    200: authResultSchema,
    409: createAppErrorSchema({
      name: 'UserExistsError',
      message: 'User Already Exists',
      statusCode: 409,
    }),
  },
};

export const loginSchema: FastifySchema = {
  body: authBodySchema,
  response: {
    200: authResultSchema,
    401: createAppErrorSchema({
      name: 'AuthenticationError',
      message: 'Invalid Username or Password',
      statusCode: 401,
    }),
  },
};
