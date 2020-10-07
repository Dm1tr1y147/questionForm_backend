import jwt from "jsonwebtoken"
import { MutationLoginArgs, Resolver, User } from "../typeDefs/typeDefs.gen"
import { ApolloContextType, JwtPayload } from "../types"

const loginResolver: Resolver<
  User,
  {},
  ApolloContextType,
  MutationLoginArgs
> = async (_, { id, admin }, { db }) => {
  try {
    const payload: JwtPayload = {
      id,
      admin,
    }
    const token = jwt.sign(payload, "SuperSecret")
    const user = await db.user.findOne({
      where: {
        id,
      },
    })

    return {
      ...user,
      token: token,
    }
  } catch (err) {
    return err
  }
}

export { loginResolver }
