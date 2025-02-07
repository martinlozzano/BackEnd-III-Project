import { config } from "dotenv"
import argsUtils from "./args.utils.js"

const { mode } = argsUtils

const path = "./src/.env." + mode
config({path: path})

const env = {
    PORT: process.env.PORT,
    MONGO_LINK: process.env.MONGO_LINK
}

export default env