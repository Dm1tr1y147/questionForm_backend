import { getDBForm } from '../db'
import { PromiseReturnType } from '@prisma/client'

type FullForm = PromiseReturnType<typeof getDBForm>

interface IFindUserParams {
  email?: string
  id?: number
}

export { FullForm, IFindUserParams }
