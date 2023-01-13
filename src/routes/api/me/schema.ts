import { FastifySchema } from 'fastify';
import { userSchema } from '../../../schema/userSchema.js';
import { createAppErrorSchema } from '../../../lib/AppError.js';

export const getMeSchema: FastifySchema = {
  response: {
    200: userSchema,
    401: createAppErrorSchema({
      name: 'UnAuthorizedError',
      message: 'Unauthorized',
      statusCode: 401,
    }),
  },
};
