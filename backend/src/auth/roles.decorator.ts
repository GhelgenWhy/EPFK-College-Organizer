import { SetMetadata } from '@nestjs/common';
import type { AppRole } from './auth.types.js';
import { ROLES_KEY } from './auth.types.js';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
