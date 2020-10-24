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
  return server && server.close(done)
})

test('server', async () => {
  await agent
    .get('/')
    .expect('Content-Type', /html/)
    .expect(200)
})
