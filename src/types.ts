import { PrismaClient } from "@prisma/client"
import {} from "express-jwt"

export type ApolloContextType = {
  db: PrismaClient
  user: JwtPayloadType | null
}

export type JwtPayloadType = {
  id: number
  email: string
}
