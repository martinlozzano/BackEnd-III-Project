import { RouterClass } from "./routerClass.js"
import { ProductController } from "../controllers/products.controller.js"
import { UserController } from "../controllers/users.controller.js"


const {
    createMockProduct
} = new ProductController()

const {
    createMockUser
} = new UserController()

export class MocksRouter extends RouterClass {
    init(){
        this.get("/product", ["PUBLIC"], createMockProduct)
        this.get("/user", ["PUBLIC"], createMockUser)
        this.get("/:user", ["PUBLIC"], async(req, res) => {
            const {usersQuantities} = req.params

            console.log(usersQuantities)
            /* console.log(productsQuantities) */

            for (let i = 0; i < usersQuantities; i++){
                createMockUser
            }

            /* for (let i = 0; i < productsQuantities; i++){
                createMockUser
            } */
        })
    }
} 