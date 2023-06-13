import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUNDED } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Test title',
  description: 'Test description',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'newUser',
  password: 'TestPassword',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        // createdId = body._id;
        // expect(createdId).toBeDefined();
        // done();
      });
  });

  //   it('/review/create (POST) - fail', (done) => {
  //     return request(app.getHttpServer())
  //       .post('/review/create')
  //       .send({ ...testDto, rating: 0 })
  //       .expect(400)
  //       .then(({ body }: request.Response) => {
  //         done();
  //       });
  //   });

  //   it('/review/:id (DELETE) - success', () => {
  //     return request(app.getHttpServer())
  //       .delete('/review/' + createdId)
  //       .set('Authorization', 'Bearer ' + token)
  //       .expect(200);
  //   });

  //   it('/review/:id (DELETE) - fail', () => {
  //     return request(app.getHttpServer())
  //       .delete('/review/' + new Types.ObjectId().toHexString())
  //       .set('Authorization', 'Bearer ' + token)
  //       .expect(404, {
  //         statusCode: 404,
  //         messasge: REVIEW_NOT_FOUNDED,
  //       });
  //   });

  //   it('/review/byProduct/:productId (GET) - success', async (done) => {
  //     return request(app.getHttpServer())
  //       .post('/review/byProduct/' + productId)
  //       .expect(200)
  //       .then(({ body }: request.Response) => {
  //         expect(body.length).toBe(1);
  //         done();
  //       });
  //   });

  //   it('/review/byProduct/:productId (GET) - fail', async (done) => {
  //     return request(app.getHttpServer())
  //       .post('/review/byProduct/' + new Types.ObjectId().toHexString())
  //       .expect(200)
  //       .then(({ body }: request.Response) => {
  //         expect(body.length).toBe(0);
  //         done();
  //       });
  //   });

  //   afterAll(() => {
  //     disconnect();
  //   });
});
