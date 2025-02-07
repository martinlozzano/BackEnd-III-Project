import { connect } from "mongoose"
import env from "../utils/env.utils.js"
import loggerUtil from "../utils/logger.util.js"

async function connDB() {
    try {
        await connect(env.MONGO_LINK)
        loggerUtil.INFO(`*DB conectada*`)
    } catch (error) {
        loggerUtil.WARN(error)
    }
}

export default connDB