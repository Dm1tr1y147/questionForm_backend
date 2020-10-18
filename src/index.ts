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

app.listen(4000, () => {
  console.log('Server ready at http://localhost:4000')
})
