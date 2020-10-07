import { checkRightsAndResolve, getForm, getFormAuthor, getForms } from "../controllers"
import {
  Form,
  QueryFormArgs,
  QuestionResolvers,
  Resolver,
  AnswerResolvers,
} from "../typeDefs/typeDefs.gen"
import { ApolloContextType } from "../types"

const formQuery: Resolver<Form, {}, ApolloContextType, QueryFormArgs> = async (
  _,
  { id },
  { db, user }
) => {
  try {
    const authorId = await getFormAuthor(db, id)

    const getFormById = () => getForm(db, id)

    return await checkRightsAndResolve(
      user!,
      { id: authorId, admin: false },
      getFormById
    )
  } catch (err) {
    return err
  }
}

const formsQuery: Resolver<Form[], {}, ApolloContextType> = async (
  _,
  __,
  { db }
) => {
  try {
    return await getForms(db, 1)
  } catch (err) {
    return err
  }
}

const QuestionResolver: QuestionResolvers = {
  __resolveType(obj: any) {
    if (obj.type) {
      return "ChoisesQuestion"
    }
    return "InputQuestion"
  },
}

const AnswerResolver: AnswerResolvers = {
  __resolveType(obj) {
    if (obj.type == "CHOISE") return "ChoiseAnswer"
    if (obj.type == "INPUT") return "InputAnswer"

    return null
  },
}

export { formQuery, formsQuery, QuestionResolver, AnswerResolver }
