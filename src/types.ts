import { PrismaClient } from '@prisma/client'

export type ApolloContextType = {
  db: PrismaClient
  user: JwtPayloadType | null
}

export type JwtPayloadType = {
  id: number
  email: string
}
