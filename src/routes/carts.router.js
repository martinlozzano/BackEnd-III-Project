import {Router} from "express"
import { CartsDaoMongo } from "../dao/CartsDao.MongoDB.js"
import { ProductsDaoMongo } from "../dao/ProductsDao.MongoDB.js"
import { isValidObjectId } from "mongoose"

export const router = Router()

CartsDaoMongo.path = "./src/data/carts.json"

router.get("/", async (req, res) =>{
    let carritos
    try {
        carritos = await CartsDaoMongo.getCarts()
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
})

router.get("/:cid", async (req, res) =>{
    let { cid } = req.params

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de id inválido."})
    }

    try {
        let carrito = await CartsDaoMongo.getCartsById(cid)

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

    /* let carritoPorId = carritos.find(cart => cart.id === cid)
    if (!carritoPorId) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `No existe el carrito con el id solicitado`})
    } */

    /* res.setHeader("Content-Type", "application/json")
    return res.status(200).json(carritoPorId) */
})

router.post("/", async (req, res) =>{
    try {
        let carritoNuevo = await CartsDaoMongo.createCart()
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
})
 
router.post("/:cid/product/:pid", async (req, res) =>{
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
        productoEncontrado = await ProductsDaoMongo.getProductsbyId(pid)

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
        await CartsDaoMongo.addProductToCart(cid, pid)
        let prodAgregado = await CartsDaoMongo.getCartsById(cid)
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
})

router.delete("/:cid/product/:pid", async (req, res) => {
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
        let carritoExiste = await CartsDaoMongo.getCartsById(cid)

        if(!carritoExiste){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
        }

        await CartsDaoMongo.deleteProductFromCart(cid, pid)

        let carritoModificado = await CartsDaoMongo.getCartsById(cid)

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
})

router.delete("/:cid", async(req,res) =>{
    let { cid } = req.params

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    try {
        let carritoExiste = await CartsDaoMongo.getCartsById(cid)

        if(!carritoExiste){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
        }

        await CartsDaoMongo.vaciarCarrito(cid)

        let carritoModificado = await CartsDaoMongo.getCartsById(cid)

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
})

router.put("/:cid", async(req, res)=>{
    let { cid } = req.params
    let productos = req.body

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }    

    try {
        let productosDB = await ProductsDaoMongo.getProducts()
        await CartsDaoMongo.actualizarCarrito(cid, productos, productosDB)
        let carritoModificado = await CartsDaoMongo.getCartsById(cid)

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

})

router.put("/:cid/product/:pid", async(req, res)=>{
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
        
        await CartsDaoMongo.actualizarCantidad(cid, pid, quantity)
        let carritoModificado = await CartsDaoMongo.getCartsById(cid)

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
})