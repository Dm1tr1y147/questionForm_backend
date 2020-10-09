import { PrismaClient } from "@prisma/client"

import { getDBFormAuthor } from "../db"
import { CheckRightsAndResolve } from "./types"

const checkRightsAndResolve: CheckRightsAndResolve = async (params) => {
  const { user, expected, controller } = params

  if (!user) throw new Error("Authentication required")

  if (expected.id.self && (!expected.admin || user.admin)) return controller(user.id)
  else if (
    (!expected.id.n || user.id == expected.id.n) &&
    (!expected.admin || user.admin)
  )
    return controller()
  throw new Error("Authentication error")
}

const getFormAuthor = async (db: PrismaClient, id: number) => {
  const author = await getDBFormAuthor(db, id)

  if (!author) throw Error("Not found")

  const authorId = author.author.id

  return authorId
}

export { checkRightsAndResolve, getFormAuthor }
