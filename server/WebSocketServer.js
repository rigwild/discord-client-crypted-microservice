import WebSocket from 'ws'

import { secret } from './config'
import { crypt } from '../utils'
import DiscordClient from './DiscordClient'

export class WebSocketServer {
  constructor() {
    this.started = false
    this.wss = null
  }

  start(httpServer) {
    return new Promise(resolve => {
      this.wss = new WebSocket.Server({ server: httpServer })

      this.wss.on('connection', ws => {
        ws.on('message', message => DiscordClient.decryptThenSendMessage(message))
      })
      this.started = true
      resolve()
    })
  }

  cryptThenBroadcastMessage(msg) {
    if (!this.started) throw new Error('WebSocket server was not started.')
    ;[...this.wss.clients].filter(x => x.readyState === WebSocket.OPEN).forEach(x => x.send(crypt(msg, secret)))
  }
}

export default new WebSocketServer()
