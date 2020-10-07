import { ApolloServer } from "apollo-server"

import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import { PrismaClient } from "@prisma/client"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = new PrismaClient()
    return { db }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
