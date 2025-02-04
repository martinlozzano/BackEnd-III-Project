import { productsModel } from "./models/productsModel.js"

export class ProductsDaoMongo {
    constructor(){
        this.model = productsModel
    }

    async get(page = 1, limit = 10, sort, query) {

        let ordenamiento = {}

        if(sort && (sort.toLowerCase() === "asc" || sort.toLowerCase() === "desc")){
            if(sort === "asc"){
                ordenamiento = {price: 1}
            } else{
                ordenamiento = {price: -1}
            }
        }

        const filtro = query ? {$expr: {$eq: [{ $toLower: "$category" }, query.toLowerCase()]}} : {}

        const productosPorParams = await this.model.paginate(filtro, {
            sort: ordenamiento,
            lean:true,
            page,
            limit
        })

        return {
            status: productosPorParams ? "success" : "error",
            payload: productosPorParams.docs,
            totalpages: productosPorParams.totalPages,
            prevPage:productosPorParams.prevPage,
            nextPage:productosPorParams.nextPage,
            page:productosPorParams.page,
            hasPrevPage:productosPorParams.hasPrevPage,
            hasNextPage:productosPorParams.hasNextPage,
            prevLink:productosPorParams.hasPrevPage ? `/api/products?limit=${limit}&page=${productosPorParams.prevPage}` : null,
            nextLink:productosPorParams.hasNextPage ? `/api/products?limit=${limit}&page=${productosPorParams.nextPage}` : null
        }
    }

    async getBy(id) {
        return await this.model.findById(id).lean()
    }

    async create(product = {}) {
        return await this.model.create(product)
    }

    async update(pid, camposActualizar) {
        return await this.model.findByIdAndUpdate(pid, camposActualizar, {new:true}).lean()
    }

    async delete(pid){
        return await this.model.findByIdAndDelete(pid).lean()
    }

    async createMock(data) {
        return await this.model.create(data)
    }
}