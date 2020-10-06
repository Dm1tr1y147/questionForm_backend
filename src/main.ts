import express from "express"
import bodyParser from "body-parser"

import { router } from "./router"
import { logger } from "./middlewares"

const app = express()

app.use(bodyParser.json())
app.use(logger)

app.use(router)

app.listen(3000, () => {
  console.log("server is listening on port 3000")
})
