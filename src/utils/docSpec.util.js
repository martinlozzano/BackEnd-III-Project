import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../utils.js"

const opts = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "CoderCommerce-Backend-III-70210 API",
            description: "Documentation of CoderCommerce"
        }
    },
    apis: [__dirname + "/docs/*.yaml"]
}

const docSpec = swaggerJSDoc(opts)

export default docSpec