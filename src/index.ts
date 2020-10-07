import { ApolloServer } from "apollo-server-express"
import express from "express"
import expressJwt from "express-jwt"
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client"

import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import { ApolloContextType } from "./types"

const app = express()

app.use(
  expressJwt({
    secret: "SuperSecret",
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<ApolloContextType> => {
    const db = new PrismaClient()

    return { db }
  },
})

server.applyMiddleware({ app })

app.listen(4000, () => {
  console.log("Server ready at http://localhost:4000")
})
