import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
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