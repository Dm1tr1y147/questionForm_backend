import {
  ChoisesQuestion,
  InputQuestion,
  Variant
} from '../typeDefs/typeDefs.gen'
import { JwtPayloadType } from '../types'

type expectedType = {
  id: number
  self: boolean
}

interface ICheckRightsAndResolve<T> {
  user: JwtPayloadType | null
  expected: expectedType
  controller: T
}

type CheckRightsAndResolve = <ReturnType, ControllerType extends Function>(
  params: ICheckRightsAndResolve<ControllerType>
) => Promise<ReturnType>

type newForm = {
  title: string
  choisesQuestions: {
    create: createChoises[]
  }
  inputQuestions: { create: InputQuestion[] }
}

type createChoises = Omit<ChoisesQuestion, 'variants'> & {
  variants: { create: Variant[] }
}

export { CheckRightsAndResolve, newForm, createChoises }
