import {Router} from "express"
export const router = Router()
import { ProductsDaoMongo } from "../dao/ProductsDao.MongoDB.js"
import { ProductController } from "../controllers/products.controller.js"

ProductsDaoMongo.path = "./src/data/products.json"

const {
    getProducts,
    getProductBy,
    createProducts,
    updateProducts,
    deleteProducts
} = new ProductController()

router.get("/", getProducts)

router.get("/:pid", getProductBy)

router.post("/", createProducts)

router.put("/:pid", updateProducts)

router.delete("/:pid", deleteProducts)