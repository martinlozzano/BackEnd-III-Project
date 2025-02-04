import { userModel } from "./models/usersModel.js"

export class UsersDaoMongo {
    constructor(){
        this.model = userModel
    }
    async get() {
        return await this.model.find()
    }

    async getBy(filter) {
        return await this.model.findOne(filter)
    }

    async create(newUser) {
        return await this.model.create(newUser)
    }

    async update(filter, dataToUpdate) {
        return await this.model.findOneAndUpdate(filter, dataToUpdate)
    }

    async delete(uid) {
        return await this.model.findByIdAndDelete({_id: uid})
    }

    async createMock(data) {
        return await this.model.create(data)
    }
}
