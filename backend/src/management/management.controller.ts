import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesService } from '../auth/roles.service.js';
import { ManagementService } from './management.service.js';
import { ApiService } from '../api/api.service.js';
import {
  parseAssignGroup,
  parseCreateEvent,
  parseCreateTask,
  parseGroup,
  parseLesson,
  parseUpdateEvent,
  parseUpdateTask,
  type WeekType,
} from './dto/management.dto.js';

/**
 * Endpoints used by the admin and starosta panels.
 * Routes under `admin/` are admin-only; the rest are open to both roles and
 * restricted to the caller's own group for starostas.
 */
@Controller('manage')
export class ManagementController {
  constructor(
    private readonly management: ManagementService,
    private readonly roles: RolesService,
    private readonly api: ApiService,
  ) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.management.getMe(user);
  }

  /** Admin forces a Moodle sync for one student (uses the token the student already linked). */
  @Post('admin/students/:userId/sync')
  @Roles('admin')
  @HttpCode(200)
  async syncStudent(@Param('userId') userId: string) {
    await this.api.syncStudentWithStoredToken(userId);
    return { synced: true };
  }

  /** Existing groups a user may choose from (read-only, any role). */
  @Get('group-options')
  listGroupOptions() {
    return this.management.listGroupOptions();
  }

  /** The user picks their own group from the existing ones; creating groups is admin-only. */
  @Put('me/group')
  chooseOwnGroup(@CurrentUser() user: AuthenticatedUser, @Body() body: unknown) {
    const groupId = (body as { groupId?: unknown } | null)?.groupId;
    if (typeof groupId !== 'number' || !Number.isInteger(groupId)) {
      throw new BadRequestException('Некоректна група');
    }
    return this.management.chooseOwnGroup(user, groupId);
  }

  // ----------------------------------------------------------------- groups

  @Get('admin/groups')
  @Roles('admin')
  listGroups() {
    return this.management.listGroups();
  }

  @Post('admin/groups')
  @Roles('admin')
  createGroup(@Body() body: unknown) {
    return this.management.createGroup(parseGroup(body));
  }

  /** Renames a group (admin only); members follow automatically because they reference the id. */
  @Patch('admin/groups/:groupId')
  @Roles('admin')
  renameGroup(@Param('groupId', ParseIntPipe) groupId: number, @Body() body: unknown) {
    return this.management.renameGroup(groupId, parseGroup(body));
  }

  @Delete('admin/groups/:groupId')
  @Roles('admin')
  deleteGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.management.deleteGroup(groupId);
  }

  // --------------------------------------------------------------- students

  @Get('admin/students')
  @Roles('admin')
  listStudents(@CurrentUser() user: AuthenticatedUser, @Query('groupId') groupId?: string) {
    const parsed = groupId ? Number(groupId) : undefined;
    return this.roles.getScope(user).then((scope) =>
      this.management.listStudents(scope, Number.isInteger(parsed) ? parsed : undefined),
    );
  }

  @Get('students')
  @Roles('starosta', 'admin')
  listOwnStudents(@CurrentUser() user: AuthenticatedUser) {
    return this.roles.getScope(user).then((scope) => this.management.listStudents(scope));
  }

  @Patch('admin/students/:userId/group')
  @Roles('admin', 'starosta')
  assignGroup(@CurrentUser() user: AuthenticatedUser, @Param('userId') userId: string, @Body() body: unknown) {
    const dto = parseAssignGroup(body);
    return this.roles.getScope(user).then((scope) =>
      this.management.assignGroup(scope, userId, dto.groupId),
    );
  }

  // -------------------------------------------------------------- schedule

  @Get('groups/:groupId/schedule')
  @Roles('starosta', 'admin')
  async readSchedule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    const scope = await this.roles.getScope(user);
    this.roles.assertGroupAccess(scope, groupId);
    return this.management.readGroupSchedule(groupId);
  }

  @Put('groups/:groupId/schedule/lesson')
  @Roles('starosta', 'admin')
  async upsertLesson(
    @CurrentUser() user: AuthenticatedUser,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: unknown,
  ) {
    const scope = await this.roles.getScope(user);
    this.roles.assertGroupAccess(scope, groupId);
    return this.management.upsertLesson(groupId, parseLesson(body));
  }

  @Delete('groups/:groupId/schedule/lesson')
  @Roles('starosta', 'admin')
  @HttpCode(200)
  async removeLesson(
    @CurrentUser() user: AuthenticatedUser,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('weekType') weekType: WeekType,
    @Query('weekday', ParseIntPipe) weekday: number,
    @Query('slot', ParseIntPipe) slot: number,
  ) {
    const scope = await this.roles.getScope(user);
    this.roles.assertGroupAccess(scope, groupId);
    if (weekType !== 'numerator' && weekType !== 'denominator') {
      throw new BadRequestException('weekType має бути numerator або denominator');
    }
    return this.management.removeLesson(groupId, weekType, weekday, slot);
  }

  // ------------------------------------------------------------------ tasks

  @Get('disciplines')
  @Roles('starosta', 'admin')
  async listDisciplines(@CurrentUser() user: AuthenticatedUser) {
    return this.management.listDisciplines(await this.roles.getScope(user));
  }

  @Get('groups/:groupId/tasks')
  @Roles('starosta', 'admin')
  async listTasks(
    @CurrentUser() user: AuthenticatedUser,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    const scope = await this.roles.getScope(user);
    this.roles.assertGroupAccess(scope, groupId);
    return this.management.listGroupTasks(groupId);
  }

  @Post('tasks')
  @Roles('starosta', 'admin')
  async createTask(@CurrentUser() user: AuthenticatedUser, @Body() body: unknown) {
    const dto = parseCreateTask(body);
    const scope = await this.roles.getScope(user);
    await this.roles.assertDisciplineAccess(scope, dto.disciplineId);
    return this.management.createTask(dto.disciplineId, dto);
  }

  @Patch('tasks/:taskId')
  @Roles('starosta', 'admin')
  updateTask(@Param('taskId', ParseIntPipe) taskId: number, @Body() body: unknown) {
    return this.management.updateTask(taskId, parseUpdateTask(body));
  }

  @Delete('tasks/:taskId')
  @Roles('starosta', 'admin')
  deleteTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.management.deleteTask(taskId);
  }

  // ----------------------------------------------------------------- events

  @Get('events')
  @Roles('admin')
  listEvents() {
    return this.management.listEvents();
  }

  @Post('events')
  @Roles('admin')
  createEvent(@CurrentUser() user: AuthenticatedUser, @Body() body: unknown) {
    return this.management.createEvent(parseCreateEvent(body), user.userId);
  }

  @Patch('events/:eventId')
  @Roles('admin')
  updateEvent(@Param('eventId', ParseIntPipe) eventId: number, @Body() body: unknown) {
    return this.management.updateEvent(eventId, parseUpdateEvent(body));
  }

  @Delete('events/:eventId')
  @Roles('admin')
  deleteEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.management.deleteEvent(eventId);
  }
}
