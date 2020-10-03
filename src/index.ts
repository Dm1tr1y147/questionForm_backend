import { GraphQLServer } from "graphql-yoga"

const typeDefs = ``

const resolvers = {}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
)
