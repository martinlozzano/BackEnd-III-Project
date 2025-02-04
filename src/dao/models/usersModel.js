import { Schema, model } from "mongoose"

const userSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    },
    role: {
        type: String,
        enum: ["user", "user-premium", "admin"],
        default: "user"
    }
})

userSchema.pre("findOne", function(){
    this.populate("cart").lean()
})
userSchema.pre("find", function(){
    this.populate("cart").lean()
})

export const userModel = model("users", userSchema)