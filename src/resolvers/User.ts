import {
  checkRightsAndResolve,
  findUserBy,
  genAndSendToken,
} from '../controllers'
import { createUser } from '../controllers/user'
import {
  MutationLoginArgs,
  MutationRegisterArgs,
  Resolver,
  ServerAnswer,
  User,
  QueryUserArgs,
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'

const loginMutation: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationLoginArgs
> = async (_, { email }, { db }) => {
  try {
    const user = await findUserBy(db, { email })

    if (user instanceof Error) throw user // Needed to a strange error

    await genAndSendToken(email, user)

    return { success: true }
  } catch (err) {
    return err
  }
}

const registerMutation: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationRegisterArgs
> = async (_, { email, name }, { db }) => {
  try {
    const user = await createUser(db, { email, name })

    if (user instanceof Error) throw user // Needed to a strange error

    await genAndSendToken(email, user)

    return { success: true }
  } catch (err) {
    return err
  }
}

const userQuery: Resolver<User, {}, ApolloContextType, QueryUserArgs> = async (
  _,
  { id },
  { db, user }
) => {
  try {
    const findUserById = (id: number) => findUserBy(db, { id })

    return await checkRightsAndResolve({
      controller: findUserById,
      expected: {
        id: id || 0,
        self: true,
      },
      user,
    })
  } catch (err) {
    return err
  }
}

export { loginMutation, registerMutation, userQuery }
