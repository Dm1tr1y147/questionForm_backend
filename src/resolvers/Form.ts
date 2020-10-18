import {
  AnswerResolvers,
  Form,
  MutationCreateFormArgs,
  MutationFormSubmitArgs,
  QueryFormArgs,
  QuestionResolvers,
  Resolver,
  ServerAnswer,
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'
import {
  checkRightsAndResolve,
  createFormFrom,
  getForm,
  getFormAuthor,
  getForms,
  submitAnswer,
} from '../controllers'

const formQuery: Resolver<Form, {}, ApolloContextType, QueryFormArgs> = async (
  _,
  { id },
  { db, user }
) => {
  try {
    const ownerId = await getFormAuthor(db, id)

    const getFormById = (userId: number) =>
      getForm(db, id, { requesterId: userId, userId: ownerId })

    return await checkRightsAndResolve({
      controller: getFormById,
      expected: {
        id: 0,
        self: true,
      },
      user,
    })
  } catch (err) {
    return err
  }
}

const formsQuery: Resolver<Form[], {}, ApolloContextType> = async (
  _,
  __,
  { db, user }
) => {
  try {
    const getFormsByUserId = (userId: number) => getForms(db, userId)

    return await checkRightsAndResolve<
      Form[],
      (userId: number) => Promise<Form[] | null>
    >({
      controller: getFormsByUserId,
      expected: {
        id: 0,
        self: true,
      },
      user,
    })
  } catch (err) {
    return err
  }
}

const createFormMutation: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationCreateFormArgs
> = async (_, params, { db, user }) => {
  const createNewForm = (id: number) => createFormFrom(db, params, id)

  return await checkRightsAndResolve({
    controller: createNewForm,
    expected: {
      id: 0,
      self: true,
    },
    user,
  })
}

const formSubmitMutation: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationFormSubmitArgs
> = async (_, params, { db, user }) => {
  const submitNewAnswer = (userId: number) => submitAnswer(db, params, userId)

  return await checkRightsAndResolve({
    controller: submitNewAnswer,
    expected: {
      id: 0,
      self: true,
    },
    user,
  })
}

const QuestionResolver: QuestionResolvers = {
  __resolveType(obj: any) {
    if (obj.type) {
      return 'ChoisesQuestion'
    }
    return 'InputQuestion'
  },
}

const AnswerResolver: AnswerResolvers = {
  __resolveType(obj) {
    if (obj.type == 'CHOISE') return 'ChoiseAnswer'
    if (obj.type == 'INPUT') return 'InputAnswer'

    return null
  },
}

export {
  AnswerResolver,
  createFormMutation,
  formQuery,
  formsQuery,
  formSubmitMutation,
  QuestionResolver,
}
