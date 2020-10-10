import { PrismaClient } from '@prisma/client'

import { Answer, MutationRegisterArgs } from '../typeDefs/typeDefs.gen'
import { IFindUserParams } from './types'
import { FormConstructor } from '../controllers/types'

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
const getDBForm = (
  db: PrismaClient,
  formId: number,
  {
    requesterId,
    userId
  }: {
    requesterId: number
    userId: number
  }
) =>
  db.form.findOne({
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
          requesterId != userId
            ? {
                user: {
                  id: requesterId
                }
              }
            : undefined
      }
    },
    where: {
      id: formId
    }
  })

/**
 * Get all forms of user
 * @param db {PrismaClient} Prisma client object
 * @param id {number} User ID
 * @example
 * const forms = await getDBFormsByUser(db, userId)
 */
const getDBFormsByUser = (db: PrismaClient, id: number) =>
  db.form.findMany({
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

const getDBFormAuthor = (db: PrismaClient, id: number) =>
  db.form.findOne({
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

const createDBUser = (
  db: PrismaClient,
  { email, name }: MutationRegisterArgs
) =>
  db.user.create({
    data: { email, name }
  })

const findDBUserBy = (db: PrismaClient, params: IFindUserParams) =>
  db.user.findOne({
    where: {
      ...params
    }
  })

const createDBForm = (db: PrismaClient, form: FormConstructor, id: number) =>
  db.form.create({
    data: {
      author: {
        connect: { id }
      },
      ...form
    }
  })

const submitDBAnswer = (
  db: PrismaClient,
  userId: number,
  formId: number,
  formAnswers: Answer[]
) =>
  db.formSubmission.create({
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

export {
  createDBForm,
  createDBUser,
  findDBUserBy,
  getDBForm,
  getDBFormAuthor,
  getDBFormsByUser,
  submitDBAnswer
}
