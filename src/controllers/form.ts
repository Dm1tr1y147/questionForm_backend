import { PrismaClient } from "@prisma/client"
import { ApolloError } from "apollo-server-express"

import { getDBForm, getDBFormByUser } from "../db"
import { FullForm } from "../db/types"
import { Form as GraphqlForm, FormSubmission } from "../typeDefs/typeDefs.gen"

const getForm = async (
  db: PrismaClient,
  id: number
): Promise<GraphqlForm | null> => {
  const dbForm: FullForm = await getDBForm(db, id)

  if (dbForm == null) throw new ApolloError("Not found")

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
    author: dbForm.author,
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

export { getForm, getForms }
