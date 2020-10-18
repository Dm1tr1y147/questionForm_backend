import { Resolvers } from '../typeDefs/typeDefs.gen'
import {
  formQuery as form,
  QuestionResolver as Question,
  AnswerResolver as Answer,
  formsQuery as forms,
  createFormMutation as createForm,
  formSubmitMutation as formSubmit,
} from './Form'
import {
  loginMutation as login,
  registerMutation as register,
  userQuery as user,
} from './User'

const resolvers: Resolvers = {
  Query: {
    form,
    forms,
    user,
  },
  Mutation: {
    login,
    register,
    createForm,
    formSubmit,
  },
  Question,
  Answer,
}

export default resolvers
