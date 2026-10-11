import { Module } from '@nestjs/common';
import { ClerkWebhooksController } from './clerk-webhooks.controller.js';
import { ClerkWebhookService } from './clerk-webhooks.service.js';

@Module({
  controllers: [ClerkWebhooksController],
  providers: [ClerkWebhookService],
})
export class AuthModule {}