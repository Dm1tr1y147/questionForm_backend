import { RequestHandler } from "express"

const logger: RequestHandler = (req, res, next) => {
  console.log(`sent ${req.method} request to ${req.hostname}${req.url}`)
  next()
}

export { logger }
