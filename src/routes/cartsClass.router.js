import { RouterClass } from "./routerClass.js"
import { CartController } from "../controllers/carts.controller.js"

const {
    getCarts,
    getCartById,
    createCart,
    updateCart,
    updateQuantity,
    deleteCart,
    deleteProductFromCart,
    addProductToCart,
    purchase
} = new CartController()

export class CartRouter extends RouterClass {
    init(){
        this.get("/", ["PUBLIC"], getCarts)
        this.get("/:cid", ["PUBLIC"], getCartById)
        this.post("/", ["PUBLIC"], createCart)
        this.post("/:cid/product/:pid", ["PUBLIC"], addProductToCart)
        this.post("/:cid/purchase", ["PUBLIC"], purchase)
        this.put("/:cid", ["PUBLIC"], updateCart)
        this.put("/:cid/product/:pid", ["PUBLIC"], updateQuantity)
        this.delete("/:cid", ["PUBLIC"], deleteCart)
        this.delete("/:cid/product/:pid", ["USER"], deleteProductFromCart)
    }
} 