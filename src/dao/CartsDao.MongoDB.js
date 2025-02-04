import { cartsModel } from "./models/cartsModel.js"

export class CartsDaoMongo {
    constructor(){
        this.model = cartsModel
    }
    async get(){
        return await this.model.find().lean()
    }

    async getBy(id) {
        return await this.model.findById(id).lean()
    }

    async getProductsFromCart(cid) {
        let cart = await this.model.findById(cid).populate("products.product").lean()

        if (!cart){
            throw new Error("No se encontró el carrito.")
        }

        return cart
    }

    async create(products){
        return await this.model.create(products)
    }

    async addProduct(cid, pid){    
        const productoEnCarrito = await this.model.findOne({
            _id: cid,
            "products.product": pid
        })

        if(productoEnCarrito){
            await this.model.updateOne(
                {_id: cid, "products.product": pid},
                {$inc: {"products.$.quantity": 1}})
        } else {
            await this.model.updateOne(
                {_id: cid},
                {$push: {products: {product: pid, quantity: 1}}})
        }
    }

    async deleteProduct(cid, pid){
        const productoEnCarrito = await this.model.findOne({
            _id: cid,
            "products.product": pid
        })

        if(!productoEnCarrito){
            throw new Error("El producto no existe en el carrito seleccionado")
        }

        await this.model.updateOne(
            {_id: cid},
            {$pull: {products: {product: pid}}})
    }

    async delete(cid){
        await this.model.updateOne(
            {_id: cid},
            {$set: {products: []}})
    }

    async update(cid, products, productosDB){
        let carritoExiste = await this.getCartsById(cid)

        if(!carritoExiste){
            throw new Error("El carrito seleccionado no existe.")
        }

        products.forEach((prod) => {
            let productoExiste = productosDB.payload.some(product => String(product._id) === prod.product)
            
            if(!productoExiste){
                throw new Error(`El producto de id ${prod.product} no existe en la DB.`)
            }
        })

        const conteo = {}

        products.forEach(item => {
            if (conteo[item.product]) {
                throw new Error(`No se pueden poner productos duplicados.`)
            } else {
                conteo[item.product] = true;
            }
        })

        return await this.model.updateOne({_id: cid},
            {$set: { products }}
        )
    }

    async updateQuant(cid, pid, quantity){
        await this.model.updateOne({_id: cid, "products.product": pid},
            {$set: { "products.$.quantity": quantity}}
        )
    }
}