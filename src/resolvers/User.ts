import {
  checkRightsAndResolve,
  findUserBy,
  sendTokenEmail
} from '../controllers'
import { createUser } from '../controllers/user'
import {
  MutationLoginArgs,
  MutationRegisterArgs,
  Resolver,
  ServerAnswer,
  User,
  QueryUserArgs
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'

const loginResolver: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationLoginArgs
> = async (_, { email }, { db }) => {
  try {
    const user = await findUserBy(db, { email })

    await sendTokenEmail(email, user)

    return { success: true }
  } catch (err) {
    return err
  }
}

const registerResolver: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationRegisterArgs
> = async (_, { email, name }, { db }) => {
  try {
    const user = await createUser(db, { email, name })

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
  const findUserById = (id: number) => findUserBy(db, { id })

  try {
    return await checkRightsAndResolve({
      controller: findUserById,
      expected: {
        id: id || 0,
        self: true
      },
      user
    })
  } catch (err) {
    return err
  }
}

export { loginResolver, registerResolver, userResolver }
