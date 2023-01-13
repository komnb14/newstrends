import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { AccessTokenPayload, validateToken } from '../lib/tokens.js';
import jwt from 'jsonwebtoken';

const { JsonWebTokenError } = jwt;

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      username: string;
    };
  }
}

export const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null);
  fastify.addHook('preHandler', async (request) => {
    const { authorization } = request.headers;
    if (!authorization || !authorization.includes('Bearer')) {
      return;
    }
    const token = authorization.split('Bearer ')[1];

    try {
      const decoded = await validateToken<AccessTokenPayload>(token);
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          //todo: 토큰 만료 에러처리 해야됨
        }
      }
    }

    request.user = {
      id: 1,
      username: 'helloooww',
    };
  });
};

export const authPlugin = fp(authPluginAsync, { name: 'authPlugin' });
