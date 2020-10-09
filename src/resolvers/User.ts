import { ApolloError, UserInputError } from 'apollo-server-express'

import { tokenGenerate } from '../controllers/auth'
import { sendToken } from '../mailer'
import {
  MutationLoginArgs,
  MutationRegisterArgs,
  Resolver,
  User,
  LoginResult
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'

const loginResolver: Resolver<
  LoginResult,
  {},
  ApolloContextType,
  MutationLoginArgs
> = async (_, { email }, { db }) => {
  try {
    const user = await db.user.findOne({
      where: {
        email
      }
    })

    if (!user) throw new UserInputError('No such user')

    const token = tokenGenerate(email, user.id)

    const res = await sendToken(user.name, email, token)

    if (res[0].statusCode != 202) return new ApolloError("Couldn't send email")

    return { success: true }
  } catch (err) {
    return err
  }
}

const registerResolver: Resolver<
  LoginResult,
  {},
  ApolloContextType,
  MutationRegisterArgs
> = async (_, { email, name }, { db }) => {
  try {
    const user = await db.user.create({
      data: { email, name }
    })

    const token = tokenGenerate(email, user.id)

    const res = await sendToken(user.name, email, token)

    if (res[0].statusCode != 202) return new ApolloError("Couldn't send email")

    return { success: true }
  } catch (err) {
    return err
  }
}

export { loginResolver, registerResolver }
