import { PrismaClient } from '@prisma/client'
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express'
import jwt from 'jsonwebtoken'

require('dotenv').config()

import { getDBFormAuthor } from '../db'
import { CheckRightsAndResolve } from './types'

const checkRightsAndResolve: CheckRightsAndResolve = async (params) => {
  const { user, expected, controller } = params

  if (!user) throw new AuthenticationError('Authentication required')

  if (expected.id.self) return controller(user.id)
  if (!expected.id.n || user.id == expected.id.n) return controller()

  throw new ForbiddenError('Access denied')
}

const getFormAuthor = async (db: PrismaClient, id: number) => {
  const author = await getDBFormAuthor(db, id)

  if (!author) throw new ApolloError('Not found')

  const authorId = author.author.id

  return authorId
}

const tokenGenerate = (email: string, id: number) => {
  return jwt.sign({ email, id }, '' + process.env.JWT_SECRET, {
    expiresIn: '7 days',
    algorithm: 'HS256'
  })
}

export { checkRightsAndResolve, getFormAuthor, tokenGenerate }
