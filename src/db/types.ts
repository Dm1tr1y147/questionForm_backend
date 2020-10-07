import { PromiseReturnType } from "@prisma/client"
import { getDBForm } from "../db"

type FullForm = PromiseReturnType<typeof getDBForm>

export { FullForm }
