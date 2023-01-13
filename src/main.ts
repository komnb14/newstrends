import { fastify } from 'fastify';
import routes from './routes/index.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js';
import AppError from './lib/AppError.js';
import 'dotenv/config';
import { authPlugin } from './plugins/authPlugin.js';

const server = fastify({
  logger: true,
});

server.get('/ping', async () => {
  return 'adadadad';
});

await server.register(fastifySwagger, swaggerConfig);
await server.register(fastifySwaggerUi, swaggerUiConfig);
server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode || 500;

  if (error instanceof AppError) {
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  return error;
});

server.register(authPlugin);
server.register(routes);

server.listen({ port: 4000 });
