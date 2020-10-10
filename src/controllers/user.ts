import { createDBUser, findDBUserBy } from '../db'
import { IFindUserParams } from '../db/types'
import { MutationRegisterArgs, User } from '../typeDefs/typeDefs.gen'
import { PrismaClient } from '@prisma/client'
import { UserInputError } from 'apollo-server-express'

const createUser = async (
  db: PrismaClient,
  { email, name }: MutationRegisterArgs
): Promise<User> => {
  if (!email || !name)
    throw new UserInputError(
      'Provide full user information',
      [!email ? [email] : [], !name ? [name] : []].flat()
    )

  return await createDBUser(db, { email, name })
}

const findUserBy = async (db: PrismaClient, params: IFindUserParams) => {
  const user = await findDBUserBy(db, params)

  if (!user) throw new UserInputError('No such user')

  return user
}

export { createUser, findUserBy }
