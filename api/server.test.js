const server = require('./server');
const request = require('supertest');
const db = require('../database/helper');

server.listen(3040, () => {
  console.log(`\n=== Test running on port 3040\n`);
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibWlrZSIsImlhdCI6MTU2NDEzNDI3MiwiZXhwIjoxNTY0MjIwNjcyfQ.kIPEQ_N8jpXiGCljB2WJ_hy64gAbWBG9Ew4GheBeKUU';

describe('[GET] /api/jokes', () => {
  it('Returns 401 on unathorized request', () => {
    request(server)
      .get('/api/jokes')
      .expect(401);
  });
  it('Returns jokes array if authenticated', () => {
    request(server)
      .get('/api/jokes')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /json/);
    // .then(res => {
    //   expect(res.body).toBeInstanceOf(Array);
    // });
  });
});

describe('[POST] /api/register', () => {
  it('Creates a user and returns the user', async () => {
    await db.remove({ username: 'john' });
    request(server)
      .post('/api/register')
      .send({ username: 'john', password: '12345' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(res => expect(res.body.username).toEqual('john'));
  });
  it('Returns bad request 400 when username and/or password is missing', async () => {
    request(server)
      .post('/api/register')
      .send({ username: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
    // .then(res =>
    //   expect(res.body.message).toEqual('Please provide username and password')
    // );
  });
});

describe('[POST] /api/login', () => {
  it('Login a user and return a token', () => {
    request(server)
      .post('/api/login')
      .send({ username: 'mike', password: '1234' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => expect(res.body.token).toBeInstanceOf(String));
  });

  it('Returns unathorized with wrong credentials', () => {
    request(server)
      .post('/api/login')
      .send({ username: 'mike', password: '1234ff' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });
});
