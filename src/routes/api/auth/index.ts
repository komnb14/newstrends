import { FastifyPluginAsync } from 'fastify';
import UserService from '../../../service/UserService.js';
import { loginSchema, registerSchema } from './schema.js';
import { AuthBody } from './types.js';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();
  fastify.post<{ Body: AuthBody }>(
    '/login',
    {
      schema: loginSchema,
    },
    async (fastify) => {
      return userService.login(fastify.body);
    },
  );

  fastify.post<{ Body: AuthBody }>(
    '/register',
    {
      schema: registerSchema,
    },
    async (fastify) => {
      return await userService.register(fastify.body);
    },
  );
};

export default authRoute;
