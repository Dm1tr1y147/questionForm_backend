import { PrismaClient } from "@prisma/client"
import { getDBForm, getDBFormAuthor, getDBFormByUser } from "../db"
import { FullForm } from "../db/types"

import { Form as GraphqlForm, FormSubmission } from "../typeDefs/typeDefs.gen"
import { JwtPayloadType } from "../types"

const getForm = async (
  db: PrismaClient,
  id?: number
): Promise<GraphqlForm | null> => {
  const dbForm: FullForm = await getDBForm(db, id)

  if (dbForm == null) throw new Error("Not found")

  const form: GraphqlForm = {
    id: dbForm.id,
    title: dbForm.title,
    questions: [...dbForm.choisesQuestions, ...dbForm.inputQuestions],
    dateCreated: dbForm.dateCreated.toString(),
    submissions: dbForm.submissions.map<FormSubmission>((submission) => ({
      answers: submission.answers,
      date: submission.date.toString(),
      id: submission.id,
    })),
  }

  return form
}

const getForms = async (
  db: PrismaClient,
  userId: number
): Promise<GraphqlForm[]> => {
  const dbForms = await getDBFormByUser(db, userId)

  const forms = [
    ...dbForms.map((form) => ({
      id: form.id,
      title: form.title,
      questions: [...form.choisesQuestions, ...form.inputQuestions],
      dateCreated: form.dateCreated.toString(),
      submissions: form.submissions.map<FormSubmission>((submission) => ({
        answers: submission.answers,
        date: submission.date.toString(),
        id: submission.id,
      })),
    })),
  ]

  return forms
}

const checkRightsAndResolve = async (
  user: JwtPayloadType,
  expected: JwtPayloadType,
  controller: any
) => {
  if (
    (!expected.id || user.id == expected.id) &&
    (!expected.admin || expected.admin)
  )
    return controller()
  throw new Error("Authentification error")
}

const getFormAuthor = async (db: PrismaClient, id: number) => {
  const author = await getDBFormAuthor(db, id)

  if (!author) throw Error("Not found")

  const authorId = author.author.id

  return authorId
}

export { getForm, getForms, checkRightsAndResolve, getFormAuthor }
