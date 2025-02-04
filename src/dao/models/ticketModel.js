import {Schema, model} from "mongoose"

const tickerSchema = new Schema(
    {
        code: {
            type: String,
            unique: true
        },
        amount: {
            type: Number
        },
        purchaser: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const ticketModel = model("tickets", tickerSchema)