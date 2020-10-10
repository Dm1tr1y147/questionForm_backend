import fs from 'fs'
import { gql } from 'apollo-server-express'

const typeDefs = gql(
  fs.readFileSync(__dirname.concat('/typeDefs.gql'), { encoding: 'utf-8' })
)

export default typeDefs
