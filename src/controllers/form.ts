import { PrismaClient, Answer } from '@prisma/client'
import { ApolloError } from 'apollo-server-express'

import { createDBForm, getDBForm, getDBFormByUser, submitDBAnswer } from '../db'
import { FullForm } from '../db/types'
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

const getForm = async (db: PrismaClient, id: number) => {
  const dbForm: FullForm = await getDBForm(db, id)

  if (dbForm == null) throw new ApolloError('Not found')

  const form: GraphqlForm = {
    id: dbForm.id,
    title: dbForm.title,
    questions: [...dbForm.choisesQuestions, ...dbForm.inputQuestions],
    dateCreated: dbForm.dateCreated.toString(),
    submissions: dbForm.submissions.map<FormSubmission>((submission) => ({
      answers: submission.answers,
      date: submission.date.toString(),
      id: submission.id
    })),
    author: dbForm.author
  }

  return form
}

const getForms = async (db: PrismaClient, userId: number) => {
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
        id: submission.id
      }))
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
    title: params.title,
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
    choisesQuestions: {
      create: parsedQuestions.flatMap<createChoises>(
        (val: InputQuestion | ChoisesQuestion, index) => {
          if ('type' in val) {
            return [
              {
                number: index,
                title: val.title,
                type: val.type,
                variants: { create: val.variants }
              }
            ]
          }
          {
            return []
          }
        }
      )
    }
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

export { getForm, getForms, createFormFrom, submitAnswer }
