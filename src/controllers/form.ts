import { Answer as DbAnswer, PrismaClient } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server-express'

import {
  Form,
  Form as GraphqlForm,
  InputQuestion,
  MutationCreateFormArgs,
  MutationFormSubmitArgs,
  ServerAnswer
} from '../typeDefs/typeDefs.gen'
import {
  CreateChoises,
  FormConstructor,
  UploadedChoisesQuestion,
  UploadedInputQuestion,
  UploadedQuestion
} from './types'
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
): Promise<Form> => {
  try {
    const dbForm = await getDBForm(db, id, user)

    if (!dbForm) throw new ApolloError('Not found', 'NOTFOUND')

    const form: GraphqlForm = {
      author: dbForm.author,
      dateCreated: dbForm.dateCreated.toString(),
      id: dbForm.id,
      questions: [...dbForm.choisesQuestions, ...dbForm.inputQuestions],
      submissions: dbForm.submissions.map((submission) => ({
        answers: submission.answers,
        date: submission.date.toString(),
        id: submission.id
      })),
      title: dbForm.title
    }

    return form
  } catch (err) {
    return err
  }
}

const getForms = async (db: PrismaClient, userId: number): Promise<Form[]> => {
  try {
    const dbForms = await getDBFormsByUser(db, userId)

    if (!dbForms) throw new ApolloError("Couldn't load forms", 'FETCHINGERROR')

    const forms: Form[] = dbForms.map((form) => ({
      dateCreated: form.dateCreated.toString(),
      id: form.id,
      questions: [...form.choisesQuestions, ...form.inputQuestions],
      submissions: form.submissions.map((submission) => ({
        answers: submission.answers,
        date: submission.date.toString(),
        id: submission.id
      })),
      title: form.title
    }))

    return forms
  } catch (err) {
    return err
  }
}

const createFormFrom = async (
  db: PrismaClient,
  params: MutationCreateFormArgs,
  id: number
): Promise<ServerAnswer> => {
  try {
    const parsedQuestions = <UploadedQuestion[]>JSON.parse(params.questions)

    const newForm: FormConstructor = {
      choisesQuestions: {
        create: parsedQuestions.flatMap<CreateChoises>(
          (uQuestion: UploadedChoisesQuestion | UploadedInputQuestion, index) =>
            'type' in uQuestion
              ? [
                  {
                    number: index,
                    title: uQuestion.title,
                    type: uQuestion.type,
                    variants: {
                      create: uQuestion.variants
                    }
                  }
                ]
              : []
        )
      },
      inputQuestions: {
        create: parsedQuestions.flatMap<InputQuestion>(
          (uQuestion: UploadedChoisesQuestion | UploadedInputQuestion, index) =>
            !('type' in uQuestion)
              ? [{ number: index, title: uQuestion.title }]
              : []
        )
      },
      title: params.title
    }

    const res = await createDBForm(db, newForm, id)

    if (!res)
      throw new ApolloError("Couldn't create new form", 'FORMCREATIONERROR')

    return { success: true }
  } catch (err) {
    return err
  }
}

const submitAnswer = async (
  db: PrismaClient,
  { answers, formId }: MutationFormSubmitArgs,
  userId: number
): Promise<ServerAnswer> => {
  try {
    const parsedAnswers = <DbAnswer[]>JSON.parse(answers)

    const res = await submitDBAnswer(db, userId, formId, parsedAnswers)

    if (!res) throw new UserInputError("Can't submit form")

    return { success: true }
  } catch (err) {
    return err
  }
}

export { createFormFrom, getForm, getForms, submitAnswer }
