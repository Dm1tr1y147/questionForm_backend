import express from 'express'
import expressJwt from 'express-jwt'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { ApolloContextType, JwtPayloadType } from './types'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { PrismaClient } from '@prisma/client'

require('dotenv').config()

const app = express()

app.use(
  expressJwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret: '' + process.env.JWT_SECRET,
  })
)

const errorHandler: express.ErrorRequestHandler = (err, _, res, __) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token')
  }
}

app.use(errorHandler)

const db = new PrismaClient()

const server = new ApolloServer({
  context: async ({
    req,
  }: {
    req: Request & {
      user: JwtPayloadType
    }
  }): Promise<ApolloContextType> => {
    const user = req.user || null
    return {
      db,
      user,
    }
  },
  debug: false,
  schema: makeExecutableSchema({
    resolvers,
    typeDefs,
  }),
})

server.applyMiddleware({ app })

const port = process.env.BACKEND_PORT || 4000

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`)
})
