import { PrismaClient } from '@prisma/client'
import { UserInputError } from 'apollo-server-express'
import { newForm } from '../controllers/types'
import { MutationRegisterArgs } from '../typeDefs/typeDefs.gen'
import { IFindUserParams } from './types'

const getDBForm = async (db: PrismaClient, id: number) => {
  return await db.form.findOne({
    where: {
      id
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
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
        }
      }
    }
  })
}

const getDBFormByUser = async (db: PrismaClient, id: number) => {
  return await db.form.findMany({
    where: {
      author: {
        id
      }
    },
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
    }
  })
}

const getDBFormAuthor = async (db: PrismaClient, id: number) => {
  return await db.form.findOne({
    where: {
      id
    },
    select: {
      author: {
        select: {
          id: true
        }
      }
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
  console.log(title, inputQuestions, choisesQuestions)

  return await db.form.create({
    data: {
      author: { connect: { id } },
      title,
      choisesQuestions,
      inputQuestions
    }
  })
}

export {
  getDBForm,
  getDBFormByUser,
  getDBFormAuthor,
  createDBUser,
  findDBUserBy,
  createDBForm
}
