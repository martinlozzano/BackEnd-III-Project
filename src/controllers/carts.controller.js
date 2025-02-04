import { ProductsDaoMongo } from "../dao/ProductsDao.MongoDB.js"
import { cartService } from "../services/index.js"
import { isValidObjectId } from "mongoose"

const productsDaoMongo = new ProductsDaoMongo()

export class CartController {
    constructor(){
        this.service = cartService
    }

    getCarts = async(req, res) => {
        let carritos
        try {
            carritos = await this.service.getCarts()
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
        res.setHeader("Content-Type", "application/json")
        return res.status(200).json(carritos)
    }
    
    getCartById = async(req, res) => {
        let { cid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de id inválido."})
        }
    
        try {
            let carrito = await this.service.getCartsById(cid)
    
            if (!carrito) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `No existe el carrito con el id solicitado`})
            }
    
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json(carrito)
    
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    createCart = async(req, res) => {
        try {
            let carritoNuevo = await this.service.createCart()
            res.setHeader("Content-Type", "application/json")
            return res.status(201).json({carritoNuevo})
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }
    
    addProductToCart = async(req, res) => {
        let { cid, pid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de cid inválido."})
        }
    
        if(!isValidObjectId(pid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de pid inválido."})
        }
        
        let productoEncontrado
        try {
            productoEncontrado = await productsDaoMongo.getBy(pid)
    
            if (!productoEncontrado) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `No existe el producto con el id solicitado` })
            }
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    
        try {
            await this.service.addProductToCart(cid, pid)
            let prodAgregado = await this.service.getCartsById(cid)
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({prodAgregado})
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }
    
    deleteCart = async(req, res) => {
        let { cid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de cid inválido."})
        }
    
        try {
            let carritoExiste = await this.service.getCartsById(cid)
    
            if(!carritoExiste){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
            }
    
            await this.service.vaciarCarrito(cid)
    
            let carritoModificado = await this.service.getCartsById(cid)
    
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({carritoModificado})
            
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    deleteProductFromCart = async(req, res) => {
        let { cid, pid } = req.params

        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de cid inválido."})
        }
    
        if(!isValidObjectId(pid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de pid inválido."})
        }
        
        try {
            let carritoExiste = await this.service.getCartsById(cid)
    
            if(!carritoExiste){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
            }
    
            await this.service.deleteProductFromCart(cid, pid)
    
            let carritoModificado = await this.service.getCartsById(cid)
    
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({carritoModificado})
            
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    updateCart = async(req, res) => {
        let { cid } = req.params
        let productos = req.body
    
        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de cid inválido."})
        }    
    
        try {
            let productosDB = await ProductsDaoMongo.getProducts()
            await this.service.updateCart(cid, productos, productosDB)
            let carritoModificado = await this.service.getCartsById(cid)
    
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({carritoModificado})
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    updateQuantity = async(req, res) => {
        let { cid, pid } = req.params
        let {quantity} = req.body
    
        quantity = Number(quantity)
    
        if(isNaN(quantity)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de quantity inválido."})
        }
    
        if(!isValidObjectId(cid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de cid inválido."})
        }
    
        if(!isValidObjectId(pid)){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"Formato de pid inválido."})
        }
    
        if(quantity < 1){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({error:"La cantidad no puede ser menor a 1."})
        }
    
        try {
            
            await this.service.updateQuantity(cid, pid, quantity)
            let carritoModificado = await this.service.getCartsById(cid)
    
            res.setHeader("Content-Type", "application/json")
            return res.status(200).json({carritoModificado})
            
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }

    purchase = async(req, res) => {
        try {
            let { cid } = req.params

            if(!isValidObjectId(cid)){
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({error:"Formato de id inválido."})
            }

            let nuevoCarrito = []

            let cart = await this.service.getCartsById(cid)

            cart.products.map(prod => {
                if(prod.product.stock >= prod.quantity){
                    let stock_nuevo = prod.product.stock - prod.quantity
                    productsDaoMongo.update(prod.product._id, {stock: stock_nuevo})
                    this.service.deleteProductFromCart(cid, prod.product._id)
                }else{
                    nuevoCarrito.push(prod)
                }
            })

            let ticketResponse = await fetch(`http://localhost:8080/api/tickets/${cid}`, {method:"POST"}).then(res=> res.json()).then(data => console.log(data)).catch(error=> console.log(error))

            res.setHeader("Content-Type", "application/json")
            return res.status(200).send(nuevoCarrito)
            
        } catch (error) {
            console.log(error)
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({
                error: `Error inesperado en el servidor.`,
                detalle: `${error.message}`
            })
        }
    }
}