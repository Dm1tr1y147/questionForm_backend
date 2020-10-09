import { ApolloContextType } from "../types"
import { Resolvers } from "../typeDefs/typeDefs.gen"
import {
  formQuery as form,
  QuestionResolver as Question,
  AnswerResolver as Answer,
  formsQuery as forms,
} from "./Form"
import { loginResolver as login, registerResolver as register } from "./User"

const resolvers: Resolvers<ApolloContextType> = {
  Query: {
    form,
    forms,
  },
  Mutation: {
    login,
    register
  },
  Question,
  Answer,
}

export default resolvers
