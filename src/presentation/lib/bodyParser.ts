import { IncomingMessage } from 'http'
import { HttpError } from '../../domain/Errors/HttpError.js'

export async function bodyParser(req: IncomingMessage) {
  let result = null
  if (req.headers['content-type'] === 'application/json') {
    result = await new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => (body += chunk.toString()))

      req.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (error) {
          reject(new HttpError('Error parsing request body', 400, 'BAD_REQUEST'))
        }
      })

      req.on('error', () => reject(new HttpError('Error parsing request body', 400, 'BAD_REQUEST')))
    })
    return result
  }
}
