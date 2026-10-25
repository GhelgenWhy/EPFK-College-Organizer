import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ApiModule } from '../api/api.module.js';
import { ManagementController } from './management.controller.js';
import { ManagementService } from './management.service.js';

@Module({
  imports: [AuthModule, ApiModule],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {}
