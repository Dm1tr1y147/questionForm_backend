import { Answer, PrismaClient } from '@prisma/client'
import { ApolloError } from 'apollo-server-express'
import {
  ChoisesQuestion,
  Form as GraphqlForm,
  FormSubmission,
  InputQuestion,
  MutationCreateFormArgs,
  MutationFormSubmitArgs,
  Question
} from '../typeDefs/typeDefs.gen'
import { createChoises, newForm } from './types'
import {
  createDBForm,
  getDBForm,
  getDBFormsByUser,
  submitDBAnswer
} from '../db'

const getForm = async (
  db: PrismaClient,
  id: number,
  user: { requesterId: number; userId: number }
) => {
  const dbForm = await getDBForm(db, id, user)

  if (dbForm == null) throw new ApolloError('Not found')

  const form: GraphqlForm = {
    author: dbForm.author,
    dateCreated: dbForm.dateCreated.toString(),
    id: dbForm.id,
    questions: [...dbForm.choisesQuestions, ...dbForm.inputQuestions],
    submissions: user.requesterId
      ? dbForm.submissions.map((submission) => ({
          answers: submission.answers,
          date: submission.date.toString(),
          id: submission.id
        }))
      : undefined,
    title: dbForm.title
  }

  return form
}

const getForms = async (db: PrismaClient, userId: number) => {
  const dbForms = await getDBFormsByUser(db, userId)

  const forms = [
    ...dbForms.map((form) => ({
      dateCreated: form.dateCreated.toString(),
      id: form.id,
      questions: [...form.choisesQuestions, ...form.inputQuestions],
      submissions: form.submissions.map<FormSubmission>((submission) => ({
        answers: submission.answers,
        date: submission.date.toString(),
        id: submission.id
      })),
      title: form.title
    }))
  ]

  return forms
}

const createFormFrom = async (
  db: PrismaClient,
  params: MutationCreateFormArgs,
  id: number
) => {
  const parsedQuestions = <Question[]>JSON.parse(params.questions)
  const newForm: newForm = {
    choisesQuestions: {
      create: parsedQuestions.flatMap<createChoises>(
        (val: InputQuestion | ChoisesQuestion, index) => {
          if ('type' in val) {
            return [
              {
                number: index,
                title: val.title,
                type: val.type,
                variants: {
                  create: val.variants
                }
              }
            ]
          }

          {
            return []
          }
        }
      )
    },
    inputQuestions: {
      create: parsedQuestions.filter(
        (val: InputQuestion | ChoisesQuestion, index) => {
          if (!('type' in val))
            return {
              number: index,
              title: val.title
            }
        }
      )
    },
    title: params.title
  }

  return createDBForm(db, newForm, id)
}

const submitAnswer = async (
  db: PrismaClient,
  { answers, formId }: MutationFormSubmitArgs,
  userId: number
) => {
  const parsedAnswers = <Answer[]>JSON.parse(answers)

  return submitDBAnswer(db, userId, formId, parsedAnswers)
}

export { createFormFrom, getForm, getForms, submitAnswer }
