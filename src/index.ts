import { ApolloServer, makeExecutableSchema } from "apollo-server-express"
import express from "express"
import expressJwt from "express-jwt"
import { PrismaClient } from "@prisma/client"

import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import { ApolloContextType, JwtPayloadType } from "./types"

const app = express()

app.use(
  expressJwt({
    secret: "SuperSecret",
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
)

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  context: async ({
    req,
  }: {
    req: Request & { user: JwtPayloadType }
  }): Promise<ApolloContextType> => {
    const db = new PrismaClient()
    const user = req.user || null

    return { db, user }
  },
})

server.applyMiddleware({ app })

app.listen(4000, () => {
  console.log("Server ready at http://localhost:4000")
})
