import { ChoiseType } from '@prisma/client'
import {
  ChoisesQuestion,
  InputQuestion,
  Variant,
} from '../typeDefs/typeDefs.gen'
import { JwtPayloadType } from '../types'

type ExpectedType = {
  id: number
  self: boolean
}

interface ICheckRightsAndResolve<T> {
  controller: T
  expected: ExpectedType
  user: JwtPayloadType | null
}

type CheckRightsAndResolve = <ReturnType, ControllerType extends Function>(
  params: ICheckRightsAndResolve<ControllerType>
) => Promise<ReturnType>

type FormConstructor = {
  choisesQuestions: { create: CreateChoises[] }
  inputQuestions: { create: InputQuestion[] }
  title: string
}

type CreateChoises = Omit<ChoisesQuestion, 'variants'> & {
  variants: { create: Variant[] }
}

type UploadedQuestion = {
  title: string
}

type UploadedChoisesQuestion = UploadedQuestion & {
  type: ChoiseType
  variants: Variant[]
}

type UploadedInputQuestion = UploadedQuestion

export {
  CheckRightsAndResolve,
  CreateChoises,
  FormConstructor,
  UploadedChoisesQuestion,
  UploadedInputQuestion,
  UploadedQuestion,
}
