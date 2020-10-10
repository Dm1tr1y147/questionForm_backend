import { PromiseReturnType } from '@prisma/client'

import { getDBForm } from '../db'

type FullForm = PromiseReturnType<typeof getDBForm>

interface IFindUserParams {
  email?: string
  id?: number
}

export { FullForm, IFindUserParams }
