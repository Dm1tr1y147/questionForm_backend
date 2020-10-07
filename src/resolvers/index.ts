import { ApolloContextType } from "../types"
import { Resolvers } from "../typeDefs/typeDefs.gen"
import {
  formQuery as form,
  QuestionResolver as Question,
  AnswerResolver as Answer,
} from "./Form"

const resolvers: Resolvers<ApolloContextType> = {
  Query: {
    form,
  },
  Question,
  Answer,
}

export default resolvers
