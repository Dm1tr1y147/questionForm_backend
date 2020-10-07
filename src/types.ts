import { PrismaClient } from "@prisma/client"
import {} from 'express-jwt'

export type ApolloContextType = {
  db: PrismaClient
}

export type JwtPayload = {
  id: number,
  admin: boolean
}