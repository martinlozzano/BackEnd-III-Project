import loggerUtil from "../utils/logger.util.js"

function errorHandler(error, req, res, next) {
    console.log(error)
     const statusCode = error.statusCode || 500
     const message = error.message || "FATAL ERROR"

     if(statusCode.toString().startsWith("4")){
        loggerUtil.WARN(message)
     } else {
        loggerUtil.FATAL(message)
     }

     return res.status(statusCode).json({message})
}

export default errorHandler 