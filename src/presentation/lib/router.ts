import { ServerResponse, IncomingMessage } from 'http'
import { bodyParser } from './bodyParser.js'

export type ExtendedResponse = ServerResponse<IncomingMessage> & {
  json: (body: any) => void
  status: (code: number) => ExtendedResponse
}
export type ExtendedRequest = IncomingMessage & { body: <T>() => Promise<T>; params: Record<string, string> }
export type RouteHandler = (req: ExtendedRequest, res: ExtendedResponse) => Promise<void>
export type Router = Awaited<ReturnType<typeof routerFactory>>
export type RouteList = Map<string, RouteHandler>

export interface EnrichedHandler {
  handler: RouteHandler
  params: string[]
}

// Regex que deve ser substituido no lugar do :param
const PARAM_REGEX = /([^/]+)/g

// Regex para testar se uma rota tem parametros
const HAS_PARAM_REGEX = /:(\w+)/g

export async function routerFactory(routes: RouteList) {
  const enrichedRoutes: Map<string, EnrichedHandler> = new Map()
  for (const [key, handler] of routes.entries()) {
    let parsedKey = key
    let enrichedObject: EnrichedHandler = {
      handler,
      params: [],
    }

    const paramMatches = key.match(HAS_PARAM_REGEX)
    if (paramMatches) {
      parsedKey = key.replaceAll(HAS_PARAM_REGEX, PARAM_REGEX.source)
      enrichedObject = {
        handler,
        params: paramMatches.map((paramName) => paramName.slice(1)),
      }
    }
    enrichedRoutes.set(parsedKey, enrichedObject)
  }

  return {
    find: async (url: string) => {
      for (const [path, enrichedHandler] of enrichedRoutes.entries()) {
        const matches = new RegExp(path).exec(url)
        if (!matches) continue

        const params = matches.slice(1).reduce((obj, param, index) => {
          obj[enrichedHandler.params[index]] = param
          return obj
        }, {} as Record<string, string>)

        return { handler: enrichedHandler.handler, params }
      }
    },
    existsWithOtherMethod: (url: string) =>
      [...enrichedRoutes.keys()].map((r) => new RegExp(r.split(' ')[1])).some((r) => r.test(url)),
    routes: enrichedRoutes,
  }
}

function extendNativeObjects(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  const extendedResponse: ExtendedResponse = Object.assign(res, {
    json: (body: any) => {
      if (!res.headersSent) res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify(body))
    },
    status: (code: number) => {
      res.statusCode = code
      return res as ExtendedResponse
    },
  })

  const extendedRequest: ExtendedRequest = Object.assign(req, {
    body: <T>() => bodyParser(req) as Promise<T>,
    params: {},
  })

  return {
    extendedRequest,
    extendedResponse,
  }
}

export async function match(router: Router, req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  const searchURL = `${req.method?.toUpperCase()} ${req.url}` ?? ''
  const maybeHandler = await router.find(searchURL)
  if (maybeHandler) {
    // Adiciona os métodos extendidos na requisição e resposta
    const { extendedRequest, extendedResponse } = extendNativeObjects(req, res)
    const { handler, params } = maybeHandler
    // Adiciona os parametros da rota na requisição
    extendedRequest.params = params
    // Executa o handler da rota
    await handler(extendedRequest, extendedResponse)
  } else {
    // Verifica se a rota existe, mas o método não
    if (router.existsWithOtherMethod(searchURL)) {
      res.writeHead(405, { 'Content-Type': 'text/plain' })
      return
    }
    // Nem a rota nem o método existe
    return res.writeHead(404, { 'Content-Type': 'text/plain' })
  }
}
