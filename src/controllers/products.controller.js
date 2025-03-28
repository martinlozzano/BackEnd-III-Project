import { isValidObjectId } from "mongoose"
import { productService } from "../services/index.js"
import { createMockProduct } from "../utils/mocks.utils.js"
import CustomError from "../utils/errors/custom.error.js"
import { forbidden, notFound } from "../utils/errors/dictionary.error.js"
import loggerUtil from "../utils/logger.util.js"

export class ProductController{
    constructor() {
        this.service = productService
    }

    getProducts = async (req, res) => {
        let {page, limit, query, sort } = req.query

        limit = Number(limit)
        page = Number(page)

        if (page && isNaN(page)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El argumento page debe ser de tipo numérico` })
        }
        if (limit && isNaN(limit)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El argumento limit debe ser de tipo numérico` })
        }

        try {
            let productos = await this.service.getProducts(page || 1, limit || 10, sort, query)

            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(productos) 
            
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    getProductBy = async (req, res, next) => {
        try {
            let { pid } = req.params

            if(!isValidObjectId(pid)){
                /* res.setHeader("Content-Type", "application/json")
                return res.status(400).json({error:"Formato de id inválido."}) */
                CustomError.new(forbidden)
            }

            let product = await this.service.getProductsBy(pid)

            if (!product) {
                CustomError.new(notFound)
            }

            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(product)

        } catch (error) {
            /* res.setHeader("Content-Type", "application/json")
            return res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            }) */
           next(error)
        }
    }

    createProducts = async (req, res) => {
        let { title, description, code, price, status, stock, category, thumbnails = [""] } = req.body

        price = parseInt(price)
        status = Boolean(status)
        stock = parseInt(stock)

        //VALIDACIONES

        if(!title || typeof title !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo title sea colocado y que sea un string.`})
        }
        if(!description || typeof description !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo description sea colocado y que sea un string.`})
        }
        if(!code || typeof code !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo code sea colocado y que sea un string.`})
        }
        if(!price || typeof price !== "number"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo price sea colocado y que sea un number.`})
        }
        if(status && typeof status !== "boolean"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo status sea colocado y que sea un boolean.`})
        }else if(status === undefined){
            status=true
        }
        if(!stock || typeof stock !== "number"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo stock sea colocado y que sea un number.`})
        }
        if(!category || typeof category !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo category sea colocado y que sea un string.`})
        }
        if(typeof thumbnails !== "object"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error: `Es necesario que el campo thumbnails sea un array de strings.`})
        }

        let productos
        try {
            productos = await this.service.getProducts()
            let existeCode = productos.payload.find(producto => producto.code === code)
            if(existeCode){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({error: `El code ingresado ya se encuentra asignado a un producto.`})
            }
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }

        let product = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }

        try {
            let productoNuevo = await this.service.createProduct(product)

            req.io.emit("productoNuevo", productoNuevo)

            res.setHeader("Content-Type", "application/json")
            return res.status(201).json({productoNuevo})
        } catch (error) {
            loggerUtil.ERROR(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    updateProducts = async (req, res) => {
        let camposActualizar = req.body

        let { pid } = req.params

        if(!isValidObjectId(pid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de id inválido."})
        }

        let esBoolean = false

        if((camposActualizar.status === "true") || (camposActualizar.status === "false")){
            esBoolean = true
        }

        //VALIDACIONES

        if(camposActualizar.code){
            if(typeof camposActualizar.code !== "string"){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `El code debe ser de tipo string.` })
            } 

            let existeCode = await this.service.getProductBy({"code": camposActualizar.code})

            if(existeCode){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `Ya hay un producto con el code propuesto.` })
            }
        }
        if(camposActualizar.title){
            if (typeof camposActualizar.title !== "string"){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `El title debe ser de tipo string.` })
            }
            let existetitle = await this.service.getProductBy({"title": camposActualizar.title})
            if(existetitle){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `Ya hay un producto con el nombre propuesto.` })
            }
        }
        if (camposActualizar.price && typeof camposActualizar.price !== "number"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El price debe ser de tipo number.` })
        }
        if (camposActualizar.status && !esBoolean){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El status debe ser de tipo boolean.` })
        }
        if (camposActualizar.description && typeof camposActualizar.description !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El description debe ser de tipo string.` })
        }
        if (camposActualizar.category && typeof camposActualizar.category !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El category debe ser de tipo string.` })
        }
        if (camposActualizar.stock && typeof camposActualizar.stock !== "number"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El stock debe ser de tipo number.` })
        }
        if (camposActualizar.thumbnails && typeof camposActualizar.thumbnails !== "object"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El thumbnails debe ser de tipo array de strings.` })
        }

        try {
            let productoModificado = await this.service.updateProduct(pid, camposActualizar)
            if(!productoModificado){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({error: `No se ha podido modificar el producto`})            
            }
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({productoModificado})
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }
    
    deleteProducts = async (req, res) => {
        let { pid } = req.params

        if(!isValidObjectId(pid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de id inválido."})
        }

        try {
            let productoEliminado = await this.service.deleteProduct(pid)
            if(!productoEliminado){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({error: `No se a podido eliminar el producto solicitado`})
            }        

            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({productoEliminado})
        } catch (error) {
            loggerUtil.ERROR(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    createMockProduct = async (req, res) => {
        try {
            const data = createMockProduct()
            const one = await this.service.createMock(data)
            return res.status(201).json({message: "¡Product created!", response: one})
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    createMockProducts = async (req, res) => {
        try {
            const {productsQuantities} = req.params
            const products = []

            for(let i = 0; i < productsQuantities; i++){
                const data = createMockProduct()
                const one = await this.service.createMock(data)

                products.push(one)
            }
            return products
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor", response: error.message })
        }
    }
}