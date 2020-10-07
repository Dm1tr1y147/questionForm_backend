import { PrismaClient } from "@prisma/client"

const getDBForm = async (db: PrismaClient, id?: number) => {
  return await db.form.findOne({
    where: {
      id: id ? id : undefined,
    },
    include: {
      author: true,
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

export { getDBForm, getDBFormByUser }
