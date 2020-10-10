import jwt from 'jsonwebtoken'
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express'
import { CheckRightsAndResolve } from './types'
import { getDBFormAuthor } from '../db'
import { PrismaClient } from '@prisma/client'
import { sendToken } from '../mailer'

require('dotenv').config()

const checkRightsAndResolve: CheckRightsAndResolve = async (params) => {
  const { user, expected, controller } = params

  if (!user) throw new AuthenticationError('Authorization required')

  if (expected.id && expected.self) return controller(expected.id || user.id)
  if (expected.self) return controller(user.id)
  if (!expected.id || user.id == expected.id) return controller()

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
    algorithm: 'HS256',
    expiresIn: '7 days'
  })
}

const sendTokenEmail = async (
  email: string,
  user: { id: number; name: string }
) => {
  const token = tokenGenerate(email, user.id)

  const res = await sendToken(user.name, email, token)

  if (res[0].statusCode != 202) return new ApolloError("Couldn't send email")
}

export { checkRightsAndResolve, getFormAuthor, sendTokenEmail, tokenGenerate }
