import { getForm } from "../db"
import {
  Form,
  FormSubmission,
  QueryFormArgs,
  QuestionResolvers,
  Resolver,
  AnswerResolvers,
} from "../typeDefs/typeDefs.gen"
import { ApolloContextType } from "../types"

const formQuery: Resolver<Form, {}, ApolloContextType, QueryFormArgs> = async (
  _,
  { id },
  { db }
) => {
  try {
    const dbForm = await getForm(db, id)

    if (dbForm == null) throw new Error("Not found")

    const form: Form = {
      id: dbForm.id,
      title: dbForm.title,
      questions: [...dbForm.choisesQuestions, ...dbForm.inputQuestions],
      dateCreated: dbForm.dateCreated.toString(),
      submissions: dbForm.submissions.map<FormSubmission>((submission) => {
        return {
          answers: submission.answers,
          date: submission.date.toString(),
          id: submission.id,
        }
      }),
    }

    return form
  } catch (err) {
    return err
  }
}

const QuestionResolver: QuestionResolvers = {
  __resolveType(obj: any, context, info) {
    if (obj.type) {
      return "ChoisesQuestion"
    }
    return "InputQuestion"
  },
}

const AnswerResolver: AnswerResolvers = {
  __resolveType(obj, context, info) {
    if (obj.type == "CHOISE") return "ChoiseAnswer"
    if (obj.type == "INPUT") return "InputAnswer"

    return null
  },
}

export { formQuery, QuestionResolver, AnswerResolver }
