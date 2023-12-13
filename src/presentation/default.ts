import { Router } from './lib/Router.js'

export function defaultRouterFactory() {
  return new Router().get('/ping', async (_, res) => void res.writeHead(200).end('pong'))
}
