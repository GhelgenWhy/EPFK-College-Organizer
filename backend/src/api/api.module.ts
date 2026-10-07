import { Module } from '@nestjs/common';
import { ApiService } from './api.service.js';
import { ApiController } from './api.controller.js';

@Module({
    providers: [ApiService],
    controllers: [ApiController],
    exports: [ApiService],
})
export class ApiModule {}