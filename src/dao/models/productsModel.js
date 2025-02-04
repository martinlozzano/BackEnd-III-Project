import mongoose, { Schema } from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: {
            type: String, unique: true
        },
        price: Number,
        status: {
            type: Boolean, default: true
        },
        stock: Number,
        category: {
            type: String,
            enum: ["", "computadoras", "perifericos", "celulares"]
        },
        image: {
            type: String,
            default: "https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png"
        }
    },
    {
        timestamps: true
    }
)

productsSchema.plugin(paginate)

export const productsModel = mongoose.model("products", productsSchema)