/* eslint-env jest */
const WebSocket = require('ws')
const server = require('../bin/server')
const { wss } = server

let socket

beforeAll(() => {
  socket = new WebSocket('ws://localhost:8080')
})

afterAll((done) => {
  wss.close()
  return server && server.close(done)
})

describe('WebSocket Server', () => {
  test('accepts a new connection', (done) => {
    socket.addEventListener('open', (event) => {
      done()
    })
  })
})
