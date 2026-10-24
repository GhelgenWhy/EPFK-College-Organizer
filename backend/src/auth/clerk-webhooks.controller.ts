import {
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { Public } from './public.decorator.js';
import { ClerkWebhookService } from './clerk-webhooks.service.js';

@Controller('webhooks/clerk')
export class ClerkWebhooksController {
  constructor(
    private readonly clerkWebhookService: ClerkWebhookService,
  ) {}

  @Public()
@Post()
@HttpCode(200)
async handleWebhook(
  @Req() req: RawBodyRequest<Request>,
) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret || !req.rawBody) {
    throw new UnauthorizedException('Webhook is not configured');
  }

  let event: {
    type: string;
    data: { id: string; [key: string]: any };
  };

  try {
    const webhook = new Webhook(secret);

    webhook.verify(req.rawBody, {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    });
    event = JSON.parse(req.rawBody.toString('utf8'));
  } catch (error) {
    console.error('Webhook verification/parsing failed:', error);
    throw new UnauthorizedException('Invalid webhook signature or payload');
  }

  if (event.type === 'user.created') {
    await this.clerkWebhookService.createUser(event.data);
  }

  return { received: true };
}
}