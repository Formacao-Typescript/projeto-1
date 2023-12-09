import { RouteHandler } from './lib/router.js'

export function defaultRouterFactory() {
  const routes = new Map<string, RouteHandler>()
  const pingHandler: RouteHandler = async (_, res) =>
    void res.writeHead(200, { 'Content-Type': 'text/plain' }).write('pong')

  routes.set('GET /ping', pingHandler)

  return routes
}
