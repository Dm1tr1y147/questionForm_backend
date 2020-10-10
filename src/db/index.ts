import { Answer, MutationRegisterArgs } from '../typeDefs/typeDefs.gen'
import { IFindUserParams } from './types'
import { newForm } from '../controllers/types'
import { PrismaClient } from '@prisma/client'
import { UserInputError } from 'apollo-server-express'

/**
 * Get form from DataBase
 *
 * @async
 * @param db {PrismaClient} Prisma client object
 * @param formId {number} Form ID
 * @param getSubmissions {boolean} Set to true if want to also get form submissions
 * @example
 * const form = await getDBForm(db, id, true)
 */
const getDBForm = async (
  db: PrismaClient,
  formId: number,
  user?: {
    requesterId: number
    userId: number
  }
) => {
  return await db.form.findOne({
    include: {
      author: {
        select: {
          email: true,
          id: true,
          name: true
        }
      },
      choisesQuestions: {
        include: {
          variants: true
        }
      },
      inputQuestions: true,
      submissions: {
        include: {
          answers: true
        },
        where:
          user?.requesterId != user?.userId
            ? {
                user: {
                  id: user?.requesterId
                }
              }
            : undefined
      }
    },
    where: {
      id: formId
    }
  })
}

/**
 * Get all forms of user
 * @param db {PrismaClient} Prisma client object
 * @param id {number} User ID
 * @example
 * const forms = await getDBFormsByUser(db, userId)
 */
const getDBFormsByUser = async (db: PrismaClient, id: number) => {
  return await db.form.findMany({
    include: {
      choisesQuestions: {
        include: {
          variants: true
        }
      },
      inputQuestions: true,
      submissions: {
        include: {
          answers: true
        }
      }
    },
    where: {
      author: {
        id
      }
    }
  })
}

const getDBFormAuthor = async (db: PrismaClient, id: number) => {
  return await db.form.findOne({
    select: {
      author: {
        select: {
          id: true
        }
      }
    },
    where: {
      id
    }
  })
}

const createDBUser = async (
  db: PrismaClient,
  { email, name }: MutationRegisterArgs
) => {
  return await db.user.create({
    data: { email, name }
  })
}

const findDBUserBy = async (db: PrismaClient, params: IFindUserParams) => {
  const user = await db.user.findOne({
    where: {
      ...params
    }
  })
  if (!user) throw new UserInputError('Not found')

  return user
}

const createDBForm = async (
  db: PrismaClient,
  { title, inputQuestions, choisesQuestions }: newForm,
  id: number
) => {
  return await db.form.create({
    data: {
      author: {
        connect: { id }
      },
      choisesQuestions,
      inputQuestions,
      title
    }
  })
}

const submitDBAnswer = async (
  db: PrismaClient,
  userId: number,
  formId: number,
  formAnswers: Answer[]
) => {
  const res = await db.formSubmission.create({
    data: {
      answers: {
        create: formAnswers
      },
      Form: {
        connect: {
          id: formId
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    }
  })

  if (!res) throw new UserInputError("Can't submit form")

  return { success: true }
}

export {
  createDBForm,
  createDBUser,
  findDBUserBy,
  getDBForm,
  getDBFormAuthor,
  getDBFormsByUser,
  submitDBAnswer
}
