import {
  checkRightsAndResolve,
  getForm,
  getFormAuthor,
  getForms,
  createFormFrom
} from '../controllers'
import { submitAnswer } from '../controllers/form'
import {
  Form,
  QueryFormArgs,
  QuestionResolvers,
  Resolver,
  AnswerResolvers,
  MutationCreateFormArgs,
  ServerAnswer,
  MutationFormSubmitArgs
} from '../typeDefs/typeDefs.gen'
import { ApolloContextType } from '../types'

const formQuery: Resolver<Form, {}, ApolloContextType, QueryFormArgs> = async (
  _,
  { id },
  { db, user }
) => {
  try {
    const authorId = await getFormAuthor(db, id)

    const getFormById = () => getForm(db, id)

    return await checkRightsAndResolve({
      user,
      expected: {
        id: 0,
        self: false
      },
      controller: getFormById
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
      user,
      expected: {
        id: 0,
        self: true
      },
      controller: getFormsByUserId
    })
  } catch (err) {
    return err
  }
}

const createForm: Resolver<
  Form,
  {},
  ApolloContextType,
  MutationCreateFormArgs
> = async (_, params, { db, user }) => {
  const createNewForm = (id: number) => createFormFrom(db, params, id)

  return await checkRightsAndResolve({
    user,
    expected: { id: 0, self: true },
    controller: createNewForm
  })
}

const formSubmit: Resolver<
  ServerAnswer,
  {},
  ApolloContextType,
  MutationFormSubmitArgs
> = async (_, params, { db, user }) => {
  const submitNewAnswer = (userId: number) => submitAnswer(db, params, userId)

  return await checkRightsAndResolve({
    user,
    expected: { id: 0, self: true },
    controller: submitNewAnswer
  })
}

const QuestionResolver: QuestionResolvers = {
  __resolveType(obj: any) {
    if (obj.type) {
      return 'ChoisesQuestion'
    }
    return 'InputQuestion'
  }
}

const AnswerResolver: AnswerResolvers = {
  __resolveType(obj) {
    if (obj.type == 'CHOISE') return 'ChoiseAnswer'
    if (obj.type == 'INPUT') return 'InputAnswer'

    return null
  }
}

export {
  formQuery,
  formsQuery,
  QuestionResolver,
  AnswerResolver,
  createForm,
  formSubmit
}
