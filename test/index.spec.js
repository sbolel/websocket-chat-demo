/* eslint-env jest */
const request = require('supertest')
const server = require('../bin/server')
const { wss } = server

let agent

beforeAll(() => {
  agent = request.agent(server)
})

afterAll((done) => {
  wss.close()
  if (server && server.listening) {
    return server.close(done)
  }
  return done()
})

test('server', async () => {
  await agent
    .get('/')
    .expect('Content-Type', /html/)
    .expect(200)
})
