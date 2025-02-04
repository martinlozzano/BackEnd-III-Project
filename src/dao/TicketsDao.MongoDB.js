import { ticketModel } from "./models/ticketModel.js"

export class TicketsDaoMongo {
    constructor(){
        this.model = ticketModel
    }
    async get() {
        return await this.model.find()
    }

    async getBy(filter) {
        return await this.model.findOne(filter)
    }

    async create(newTicket) {
        return await this.model.create(newTicket)
    }

    async update(filter, dataToUpdate) {
        return await this.model.findOneAndUpdate(filter, dataToUpdate)
    }

    async delete(uid) {
        return await this.model.findByIdAndDelete({_id: uid})
    }
}