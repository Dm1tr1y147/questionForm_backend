import { JwtPayloadType } from "../types"

type expectedType = {
  id: {
    n: number
    self: boolean
  }
  admin: boolean
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
