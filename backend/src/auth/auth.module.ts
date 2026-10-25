import { Module } from '@nestjs/common';
import { ClerkWebhooksController } from './clerk-webhooks.controller.js';
import { ClerkWebhookService } from './clerk-webhooks.service.js';
import { RolesService } from './roles.service.js';

@Module({
  controllers: [ClerkWebhooksController],
  providers: [ClerkWebhookService, RolesService],
  exports: [RolesService],
})
export class AuthModule {}
