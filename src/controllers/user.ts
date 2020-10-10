import { createDBUser, findDBUserBy } from '../db'
import { IFindUserParams } from '../db/types'
import { MutationRegisterArgs, User } from '../typeDefs/typeDefs.gen'
import { PrismaClient } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server-express'

const createUser = async (
  db: PrismaClient,
  { email, name }: MutationRegisterArgs
): Promise<User> => {
  try {
    if (!email || !name)
      throw new UserInputError(
        'Provide full user information',
        [!email ? [email] : [], !name ? [name] : []].flat()
      )

    const newUser = await createDBUser(db, { email, name })

    if (!newUser)
      throw new ApolloError("Couldn't create user", 'USERCREATIONERROR')

    return newUser
  } catch (err) {
    return err
  }
}

const findUserBy = async (
  db: PrismaClient,
  params: IFindUserParams
): Promise<User> => {
  try {
    const user = await findDBUserBy(db, params)

    if (!user) throw new UserInputError('No such user')

    return user
  } catch (err) {
    return err
  }
}

export { createUser, findUserBy }
