import express from "express"

const router = express.Router()

router.get(
  "/api/test",
  (req: express.Request, res: express.Response) => {
    return res.send(`Hello, ${req.query.name}`)
  }
)

router.post(
  "/api/test",
  async (req: express.Request, res: express.Response) => {
    return res.send(`Hello, hidden ${req.body.name}`)
  }
)

export { router }
