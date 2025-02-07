import { RouterClass } from "./routerClass.js"
import { ProductController } from "../controllers/products.controller.js"
import { UserController } from "../controllers/users.controller.js"
import passport from "passport"

const {
    createMockProduct,
    createMockProducts
} = new ProductController()

const {
    createMockUser,
    createMockUsers
} = new UserController()

export class MocksRouter extends RouterClass {
    init(){
        this.post("/product", ["PUBLIC"], createMockProduct)
        this.post("/user", ["PUBLIC"], createMockUser)
        this.post("/:usersQuantities/:productsQuantities", ["PUBLIC"], async(req, res) =>{
            try {
                let { usersQuantities, productsQuantities } = req.params

                usersQuantities = parseInt(usersQuantities, 10)
                productsQuantities = parseInt(productsQuantities, 10)

                if (isNaN(usersQuantities) || isNaN(productsQuantities) || usersQuantities < 1 || productsQuantities < 1) {
                    return res.status(400).json({ error: "Los parámetros deben ser números enteros positivos" })
                }

                const [users, products] = await Promise.all([
                    createMockUsers(req, res, true),
                    createMockProducts(req, res, true)
                ])

                res.status(201).json([{message: "Users created", response: users}, {message: "Products created", response: products}])

            } catch (error) {
                res.status(500).json({ error: "Error interno del servidor", response: error.message })
            }
        })
    }
} 