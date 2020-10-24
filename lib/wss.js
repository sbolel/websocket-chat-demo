/**
 * @module ws/lib/ws
 */
const WebSocket = require('ws')
const log = require('./log')

const HEARTBEAT_INTERVAL = 30000
const WSS_PORT = 8080

function onPing () {
  log.debug('heartbeat', 'ping')
}

function onPong () {
  this.isAlive = true
  log.debug('heartbeat', 'pong')
}

/**
 * @type {WebSocket.Server} wss - a websocket server instance listening on port 8080
 * @see {@link https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocketserver}
 */
const wss = new WebSocket.Server({
  port: WSS_PORT
})

/**
 * @type {number} interval - numeric id of timer for closing stale connections by playing
 *  ping/pong with clients to identify and terminate unresponsive connections. In each
 *  interval cycle, sends pings to each client, and in the next cycle, checks that the
 *  "pong" event was received from the client. If the client does not acknowledge with a
 *  "pong" and the isActive property is equal to false, the connection is terminated.
 */
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    // if this websocket client has not responded to the ping with a pong, terminate it.
    if (ws.isAlive === false) {
      log('ws', 'terminate')
      return ws.terminate()
    }
    // otherwise, set client.isAlive to false, and ping the client to test it next interval.
    ws.isAlive = false
    ws.ping(onPing)
  })
}, HEARTBEAT_INTERVAL)

/**
 * @listens {'connection'} listens for new connections opened by clients and sets handlers
 *  for each new connection to the websocket server.
 */
wss.on('connection', (ws, req) => {
  log.debug('wss-connection', req.socket.remoteAddress)

  // mark this websocket connection as alive by setting the isAlive property to true.
  ws.isAlive = true

  /**
   * @listens {'message'} listens for message events from the client.
   * @emits {'message'} when a message is received from the client; echoes the payload back.
   */
  ws.on('message', (data) => {
    log('message', `${data}`)
    ws.send(data)
  })

  /**
   * @listens {'pong'} listens for "pong" event emitted by client to set isAlive back to true.
   */
  ws.on('pong', onPong)

  /**
   * @listens {'close'} handles "close" event emitted when a client disconnects.
   */
  ws.on('close', (code, reason) => {
    log('ws-close', `${code}: ${reason}`)
  })
})

/**
 * @listens {'close'} listens for the "close" event emitted from the websocket server,
 *  and handles it by clearing the ping/pong interval and terminating all active clients.
 */
wss.on('close', () => {
  log('wss-close', 'WebSocket.Server is being closed...')
  clearInterval(interval)
})

/**
 * @listens {'error'} listens for the "close" event emitted from the websocket server,
 *  and handles it by clearing the ping/pong interval and terminating all active clients.
 */
wss.on('error', (error) => {
  log.error('wss-error', error)
  wss.close()
})

module.exports = wss
