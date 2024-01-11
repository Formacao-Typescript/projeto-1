import type { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

export default (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) {
      const result = schema.parse(req.body)
      req.body = result
    }
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json(error)
    }
    next(error)
  }
}
