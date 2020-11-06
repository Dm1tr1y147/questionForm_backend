import { createDBUser, findDBUserBy } from '../db'
import { IFindUserParams } from '../db/types'
import { MutationRegisterArgs, User } from '../typeDefs/typeDefs.gen'
import { PrismaClient } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server-express'
import { formatForms } from './form'
import { formSubmitMutation, formsQuery } from 'resolvers/Form'

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
    const dbUser = await findDBUserBy(db, params)

    if (!dbUser) throw new UserInputError('No such user')

    const user: User = {
      ...dbUser,
      forms: formatForms(dbUser.forms),
      formSubmissions: dbUser.formSubmissions.map((formSubmission) => ({
        ...formSubmission,
        date: formSubmission.date.toString(),
        form: formSubmission.Form && {
          ...formSubmission.Form,
          dateCreated: formSubmission.Form?.dateCreated.toString(),
        },
      })),
    }

    return user
  } catch (err) {
    return err
  }
}

export { createUser, findUserBy }
