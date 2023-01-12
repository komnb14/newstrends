import { fastify } from 'fastify';
import routes from './routes/index.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js';

const server = fastify({
  logger: true,
});

server.get('/ping', async () => {
  return 'adadadad';
});

await server.register(fastifySwagger, swaggerConfig);
await server.register(fastifySwaggerUi, swaggerUiConfig);

server.register(routes);

server.listen({ port: 4000 });
