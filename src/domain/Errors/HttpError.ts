export class HttpError extends Error {
  readonly status: number
  readonly code: string
  constructor(message: string = 'Http Error', status: number = 500, code: string = 'HTTP_ERROR') {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}
