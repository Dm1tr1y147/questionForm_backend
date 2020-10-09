import { ApolloContextType } from '../types'
import { Resolvers } from '../typeDefs/typeDefs.gen'
import {
  formQuery as form,
  QuestionResolver as Question,
  AnswerResolver as Answer,
  formsQuery as forms,
  createForm
} from './Form'
import {
  loginResolver as login,
  registerResolver as register,
  userResolver as user
} from './User'

const resolvers: Resolvers<ApolloContextType> = {
  Query: {
    form,
    forms,
    user
  },
  Mutation: {
    login,
    register,
    createForm
  },
  Question,
  Answer
}

export default resolvers
