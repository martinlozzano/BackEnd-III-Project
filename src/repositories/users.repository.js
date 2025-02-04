import { UserDto } from "../dto/users.dto.js"

export class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    getUsers = async () =>{
        return await this.dao.get()
    }

    getUserby = async (filter) =>{
        const user = await this.dao.getBy(filter)
        const userDto = new UserDto(user)
        return userDto 
    }
    
    createUser = async (newUser) =>{
        return await this.dao.create(newUser)
    }
    
    updateUser = async (id, userToUpdate) =>{
        return await this.dao.update(id, userToUpdate)
    }
    
    deleteUser = async (id) =>{
        return await this.dao.delete(id)
    }
}