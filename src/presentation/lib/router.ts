import { ServerResponse, IncomingMessage } from 'http'
import { bodyParser } from './bodyParser.js'
import { inspect } from 'util'

export type ExtendedResponse = ServerResponse<IncomingMessage> & {
  json: (body: any) => void
  status: (code: number) => ExtendedResponse
}
export type ExtendedRequest = IncomingMessage & { body: <T>() => Promise<T>; params: Record<string, string> }
export type RouteHandler = (req: ExtendedRequest, res: ExtendedResponse) => Promise<void>
export type RouteList = Map<string, RouteHandler>

export interface EnrichedHandler {
  handler: RouteHandler
  params: string[]
}

// Regex que deve ser substituido no lugar do :param
const PARAM_REGEX = /([^/]+)/g

// Regex para testar se uma rota tem parametros
const HAS_PARAM_REGEX = /:(\w+)/g

export class Router {
  private enrichedRoutes: Map<string, EnrichedHandler> = new Map()
  private baseRoutes: RouteList = new Map()
  private readonly prefix: string = ''

  constructor(prefix?: string)
  constructor(routes?: Router[])
  constructor(routesOrPrefix?: string | Router[]) {
    if (!routesOrPrefix) return

    if (typeof routesOrPrefix === 'string') {
      this.prefix = `${routesOrPrefix}`
      return
    }

    if (Array.isArray(routesOrPrefix) && routesOrPrefix.every((r) => r instanceof Router)) {
      this.enrichedRoutes = new Map(routesOrPrefix.flatMap((r) => [...r.enrichedRoutes]))
      this.baseRoutes = new Map(routesOrPrefix.flatMap((r) => [...r.baseRoutes]))
    }
  }

  get routes() {
    return this.baseRoutes
  }

  get parsedRoutes() {
    return this.enrichedRoutes
  }

  get(route: string, handler: RouteHandler) {
    return this.#newRoute('GET', route, handler)
  }

  post(route: string, handler: RouteHandler) {
    return this.#newRoute('POST', route, handler)
  }

  put(route: string, handler: RouteHandler) {
    return this.#newRoute('PUT', route, handler)
  }

  patch(route: string, handler: RouteHandler) {
    return this.#newRoute('PATCH', route, handler)
  }

  delete(route: string, handler: RouteHandler) {
    return this.#newRoute('DELETE', route, handler)
  }

  existsWithOtherMethod(url: string) {
    return [...this.enrichedRoutes.keys()].map((r) => new RegExp(r.split(' ')[1])).some((r) => r.test(url))
  }

  /**
   * Executa uma requisição
   */
  async executeHandler(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const searchURL = `${req.method?.toUpperCase()} ${req.url}` ?? ''
    const maybeHandler = await this.#findAndParse(searchURL)
    let duration = performance.now()
    process.stdout.write(`<- ${searchURL} from ${req.headers.host ?? 'unknown host'}\n`)

    if (maybeHandler) {
      // Adiciona os métodos extendidos na requisição e resposta
      const { extendedRequest, extendedResponse } = this.#extendNativeObjects(req, res)
      const { handler, params } = maybeHandler
      // Adiciona os parametros da rota na requisição
      extendedRequest.params = params
      // Executa o handler da rota
      await handler(extendedRequest, extendedResponse)
      duration = performance.now() - duration
    } else {
      // Verifica se a rota existe, mas o método não
      if (this.existsWithOtherMethod(searchURL)) {
        res.writeHead(405, { 'Content-Type': 'text/plain' })
        return
      }
      // Nem a rota nem o método existe
      return res.writeHead(404, { 'Content-Type': 'text/plain' })
    }

    process.stdout.write(`-> ${searchURL} :: ${res.statusCode} (${duration.toFixed(2)}ms)\n`)
  }

  #newRoute(method: string, route: string, handler: RouteHandler) {
    const parsedRoute = `${method.toUpperCase()} ${this.prefix}${route === '/' ? '' : route}`
    this.baseRoutes.set(parsedRoute, handler)

    const [parsedURL, enrichedHandler] = this.#parse(parsedRoute, handler)[0]
    this.enrichedRoutes.set(parsedURL, enrichedHandler)
    return this
  }

  #parse(routes: RouteList): [string, EnrichedHandler][]
  #parse(url: string, handler: RouteHandler): [string, EnrichedHandler][]
  #parse(listOrUrl: RouteList | string, handler?: RouteHandler) {
    const routeMap: Map<string, EnrichedHandler> = new Map()
    if (typeof listOrUrl === 'string' && handler) return this.#parse(new Map([[listOrUrl, handler]]))

    if (listOrUrl instanceof Map) {
      for (const [key, handler] of listOrUrl.entries()) {
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
        routeMap.set(parsedKey, enrichedObject)
      }
    }

    return Array.from(routeMap)
  }

  #extendNativeObjects(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
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

  /**
   * Procura uma rota na lista de rotas enriquecidas e retorna o handler e os parametros
   * da primeira rota encontrada
   */
  async #findAndParse(url: string) {
    for (const [path, enrichedHandler] of this.enrichedRoutes.entries()) {
      const matches = new RegExp(path).exec(url)
      if (!matches) continue

      const params = matches.slice(1).reduce((obj, param, index) => {
        obj[enrichedHandler.params[index]] = param
        return obj
      }, {} as Record<string, string>)

      return { handler: enrichedHandler.handler, params }
    }
  }
}
