import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  // Personal, frequently changing API data: never let the browser reuse a cached body.
  // Without this Express answers 304 Not Modified and the client keeps an old payload.
  app.getHttpAdapter().getInstance().set('etag', false);
  app.use((_req: unknown, res: { setHeader(name: string, value: string): void }, next: () => void) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  // await app.listen(process.env.PORT ?? 3000);
  const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => new URL(origin.trim()).origin);
  const backendOrigin = new URL(process.env.BACKEND_ORIGIN || 'http://localhost:3000');
  const port = Number(backendOrigin.port || process.env.PORT || 3000);
  app.enableCors({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  await app.listen(port);
}
await bootstrap();
