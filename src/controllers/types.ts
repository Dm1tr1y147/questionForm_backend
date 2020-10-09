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

export { CheckRightsAndResolve }
