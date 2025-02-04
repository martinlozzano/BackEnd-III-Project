import { RouterClass } from "./routerClass.js"
import { ProductController } from "../controllers/products.controller.js"

const {
    getProducts,
    getProductBy,
    createProducts,
    updateProducts,
    deleteProducts,
} = new ProductController()

export class ProductRouter extends RouterClass {
    init(){
        this.get("/", ["PUBLIC"], getProducts)
        this.get("/:pid", ["PUBLIC"], getProductBy)
        this.post("/", ["ADMIN"], createProducts)
        this.put("/:pid", ["ADMIN"], updateProducts)
        this.delete("/:pid", ["ADMIN"], deleteProducts)
    }
} 