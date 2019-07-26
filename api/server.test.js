const server = require('./server');
const request = require('supertest');

server.listen(3000, () => {
  console.log(`\n=== Testing on listening on port 3000\n`);
});

describe('[GET] /api/jokes', () => {
  it('Returns 401 on unathorized request', () => {
    request(server)
      .get('/api/jokes')
      .expect(401);
  });
});

describe('[POST] /api/register', async () => {
  it('Creates a user and returns the user', () => {
    request(server)
      .post('/api/register')
      .send({ username: 'john', password: '12345' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
