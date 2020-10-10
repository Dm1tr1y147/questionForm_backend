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
  controller: T
  expected: expectedType
  user: JwtPayloadType | null
}

type CheckRightsAndResolve = <ReturnType, ControllerType extends Function>(
  params: ICheckRightsAndResolve<ControllerType>
) => Promise<ReturnType>

type newForm = {
  choisesQuestions: {
    create: createChoises[]
  }
  inputQuestions: { create: InputQuestion[] }
  title: string
}

type createChoises = Omit<ChoisesQuestion, 'variants'> & {
  variants: { create: Variant[] }
}

export { CheckRightsAndResolve, createChoises, newForm }
