import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Management API without a session (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('rejects anonymous reads with 401', async () => {
    await request(app.getHttpServer()).get('/manage/me').expect(401);
    await request(app.getHttpServer()).get('/manage/admin/groups').expect(401);
    await request(app.getHttpServer()).get('/manage/disciplines').expect(401);
  });

  it('rejects anonymous writes with 401', async () => {
    await request(app.getHttpServer())
      .post('/manage/admin/groups')
      .send({ groupName: 'IPZ-21' })
      .expect(401);
    await request(app.getHttpServer())
      .delete('/manage/tasks/1')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
