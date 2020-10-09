import { PrismaClient } from '@prisma/client'
import { UserInputError } from 'apollo-server-express'
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

const createUser = async (
  db: PrismaClient,
  { email, name }: MutationRegisterArgs
) => {
  return await db.user.create({
    data: { email, name }
  })
}

const findUserBy = async (db: PrismaClient, params: IFindUserParams) => {
  const user = await db.user.findOne({
    where: {
      ...params
    }
  })
  if (!user) throw new UserInputError('Not found')

  return user
}

export { getDBForm, getDBFormByUser, getDBFormAuthor, createUser, findUserBy }
