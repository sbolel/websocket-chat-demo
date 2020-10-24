/**
 * @module ws
 */
const http = require('http')
const stat = require('node-static')
const log = require('./lib/log')
const wss = require('./lib/wss')

const file = new stat.Server('./www')

const server = http.createServer((req, res) => {
  req.on('end', () => file.serve(req, res)).resume()
})

server.on('upgrade', (req, socket, head) => {
  log('server-upgrade', req.socket.remoteAddress)

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

server.on('close', () => {
  log('server-close', 'Stopping server...')
  wss.close(() => {
    log('server-close', 'Stopped.')
  })
})

server.wss = wss

module.exports = server
