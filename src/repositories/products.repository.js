export class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts = async () => {
        return await this.dao.get()
    }
    
    getProductsBy = async (filter) => {
        return await this.dao.getBy(filter)
    }
    
    createProduct = async (newProduct) => {
        return await this.dao.create(newProduct)
    }
    
    updateProduct = async (pid, productToUpdate) => {
        return await this.dao.update(pid, productToUpdate)
    }
    
    deleteProduct = async (pid) => {
        return await this.dao.delete(pid)
    }

    createMock = async (data) => {
        return await this.dao.createMock(data)
    }
}