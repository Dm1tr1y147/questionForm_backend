'use strict'
import { UserInputError } from 'apollo-server-express'
import { Answer } from '@prisma/client'
import {
  UploadedChoisesQuestion,
  UploadedInputQuestion,
  UploadedQuestion,
} from './types'
import { ChoisesQuestion, InputQuestion, Variant } from 'typeDefs/typeDefs.gen'

const choisesVariants = ['CHECK', 'CHOOSE', 'SELECT']

const validateCreateFormParameters = async (
  title: string,
  questions: UploadedQuestion[]
) => {
  if (!title)
    throw new UserInputError("Form title can't be empty", {
      invalidArgs: ['title'],
    })

  questions.forEach(
    (question: UploadedChoisesQuestion | UploadedInputQuestion) => {
      if (!question.title)
        throw new UserInputError("Question title can't be empty", {
          invalidArgs: ['questions'],
        })

      if ('type' in question) {
        if (!question.variants || question.variants.length < 1)
          throw new UserInputError(
            'Question with choises must have at least one answer variant',
            { invalidArgs: ['questions'] }
          )

        question.variants.forEach((variant) => {
          if (!variant.text || variant.text.length < 1)
            throw new UserInputError("Choises variant text can't be empty", {
              invalidArgs: ['questions'],
            })
        })

        if (!choisesVariants.includes(question.type))
          throw new UserInputError(
            'Question with choises must be of one of supported types',
            { invalidArgs: ['questions'] }
          )
      }
    }
  )
}

const validateSubmitAnswerParameters = async (
  answers: Answer[],
  questions: (
    | (ChoisesQuestion & {
        variants: Variant[]
      })
    | InputQuestion
  )[]
) => {
  questions.forEach((question, questionIndex) => {
    const answer = answers[questionIndex]

    if (!answer)
      throw new UserInputError('Every required question must have answer', {
        invalidArgs: ['answers'],
      })

    if (!answer.type)
      throw new UserInputError('Type must be specified for answer', {
        invalidArgs: ['answers'],
      })

    if (answer.type !== 'CHOISE' && answer.type !== 'INPUT')
      throw new UserInputError('Answer must have supported type', {
        invalidArgs: ['answers'],
      })

    if (answer.type === 'CHOISE' && !('type' in question))
      throw new UserInputError(
        `Answer ${questionIndex + 1} must be of 'INPUT' type`,
        {
          invalidArgs: ['answers'],
        }
      )

    if (answer.type === 'INPUT' && 'type' in question)
      throw new UserInputError(
        `Answer ${questionIndex + 1} must be of 'CHOISE' type`,
        {
          invalidArgs: ['answers'],
        }
      )

    if (answer.type === 'CHOISE' && answer.userChoise === null)
      throw new UserInputError(
        "Question of type 'CHOISE' must have choise number set",
        {
          invalidArgs: ['answers'],
        }
      )

    if (answer.type === 'INPUT' && answer.userInput === null)
      throw new UserInputError(
        "Question of type 'INPUT' must have input string",
        {
          invalidArgs: ['answers'],
        }
      )

    if (
      answer.userChoise !== null &&
      (question as ChoisesQuestion).variants &&
      answer.userChoise > (question as ChoisesQuestion).variants.length - 1
    )
      throw new UserInputError(
        "Can't have chosen number bigger than amount of variants: " +
          (question as ChoisesQuestion).variants.length,
        {
          invalidArgs: ['answers'],
        }
      )
  })
}

export { validateCreateFormParameters, validateSubmitAnswerParameters }
