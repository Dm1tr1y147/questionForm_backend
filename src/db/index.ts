import { PrismaClient } from "@prisma/client"

const getDBForm = async (db: PrismaClient, id: number) => {
  return await db.form.findOne({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        },
      },
      choisesQuestions: {
        include: {
          variants: true,
        },
      },
      inputQuestions: true,
      submissions: {
        include: {
          answers: true,
        },
      },
    },
  })
}

const getDBFormByUser = async (db: PrismaClient, id: number) => {
  return await db.form.findMany({
    where: {
      author: {
        id,
      },
    },
    include: {
      choisesQuestions: {
        include: {
          variants: true,
        },
      },
      inputQuestions: true,
      submissions: {
        include: {
          answers: true,
        },
      },
    },
  })
}

const getDBFormAuthor = async (db: PrismaClient, id: number) => {
  return await db.form.findOne({
    where: {
      id,
    },
    select: {
      author: {
        select: {
          id: true,
        },
      },
    },
  })
}

export { getDBForm, getDBFormByUser, getDBFormAuthor }
