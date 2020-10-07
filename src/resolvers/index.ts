import { ApolloContextType } from "../types"
import { Resolvers } from "../typeDefs/typeDefs.gen"
import {
  formQuery as form,
  QuestionResolver as Question,
  AnswerResolver as Answer,
  formsQuery as forms,
} from "./Form"
import { loginResolver as login } from "./User"

const resolvers: Resolvers<ApolloContextType> = {
  Query: {
    form,
    forms,
  },
  Mutation: {
    login,
  },
  Question,
  Answer,
}

export default resolvers
