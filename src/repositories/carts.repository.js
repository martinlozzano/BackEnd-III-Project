export class CartsRepository {
    constructor(dao){
        this.dao = dao
    }

    getCarts = async () => {
        return await this.dao.get()
    }
    
    getCartsById = async (cid) => {
        return await this.dao.getBy(cid)
    }
    
    createCart = async () => {
        return await this.dao.create()
    }
    
    addProductToCart = async (cid, pid) => {
        return await this.dao.addProduct(cid, pid)
    }
    updateCart = async (cid, productos, productosDB) => {
        return await this.dao.update(cid, productos, productosDB)
    }
    updateQuantity = async (cid, pid, quantity) => {
        return await this.dao.updateQuant(cid, pid, quantity)
    }
    
    deleteProductFromCart = async (cid, pid) => {
        return await this.dao.deleteProduct(cid, pid)
    }
    deleteCart = async (pid) => {
        return await this.dao.delete(pid)
    }
}