import { PrismaClient } from "@prisma/client"

const getForm = async (db: PrismaClient, id: number) =>
  db.form.findOne({
    where: {
      id: id,
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

export { getForm }
