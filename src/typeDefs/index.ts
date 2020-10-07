import { gql } from "apollo-server-express"
import fs from "fs"

const typeDefs = gql(
  fs.readFileSync(__dirname.concat("/typeDefs.gql"), { encoding: "utf-8" })
)

export default typeDefs
