import { UserInputError } from 'apollo-server-express'

import { checkRightsAndResolve, sendTokenEmail } from '../controllers'
import { createDBUser, findDBUserBy } from '../db'
import {
  MutationLoginArgs,
  MutationRegisterArgs,
  Resolver,
  LoginResult,
  User,
  QueryUserArgs
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'

const loginResolver: Resolver<
  LoginResult,
  {},
  ApolloContextType,
  MutationLoginArgs
> = async (_, { email }, { db }) => {
  try {
    const user = await findDBUserBy(db, { email })

    if (!user) throw new UserInputError('No such user')

    await sendTokenEmail(email, user)

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
    const user = await createDBUser(db, { email, name })

    await sendTokenEmail(email, user)

    return { success: true }
  } catch (err) {
    return err
  }
}

const userResolver: Resolver<
  User,
  {},
  ApolloContextType,
  QueryUserArgs
> = async (_, { id }, { db, user }) => {
  const findUserById = (id: number) => findDBUserBy(db, { id })

  try {
    return await checkRightsAndResolve({
      user,
      expected: { id: id || 0, self: true },
      controller: findUserById
    })
  } catch (err) {
    return err
  }
}

export { loginResolver, registerResolver, userResolver }
