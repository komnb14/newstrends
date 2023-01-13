import { FastifyPluginAsync } from 'fastify';
import { getMeSchema } from './schema.js';
import AppError from '../../../lib/AppError.js';

export const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: getMeSchema }, async (request) => {
    if (request.user) {
      throw new AppError('UnAuthorizedError');
    }
    return 'hello world';
  });
};
